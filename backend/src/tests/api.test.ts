import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { resetStore } from '../lib/store';

const app = createApp();

async function register(email = 'muse@closetcraft.app') {
  const res = await request(app).post('/api/auth/register').send({
    email,
    password: 'password123',
    name: 'Muse'
  });
  return res;
}

describe('Closet Craft API', () => {
  beforeEach(() => resetStore());

  it('registers and logs in with httpOnly cookie', async () => {
    const created = await register();
    expect(created.status).toBe(201);
    expect(created.headers['set-cookie']?.join(' ')).toMatch(/token=/);
    const login = await request(app).post('/api/auth/login').send({ email: 'muse@closetcraft.app', password: 'password123' });
    expect(login.status).toBe(200);
    const me = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${login.body.token}`);
    expect(me.body.email).toBe('muse@closetcraft.app');
  });

  it('supports garment CRUD', async () => {
    const auth = await register();
    const token = auth.body.token;
    const created = await request(app)
      .post('/api/garments')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Ivory Silk Blouse', category: 'tops', primaryColor: 'Cream', colorHex: '#FDF6EC' });
    expect(created.status).toBe(201);
    const list = await request(app).get('/api/garments').set('Authorization', `Bearer ${token}`);
    expect(list.body.items).toHaveLength(1);
    const patched = await request(app)
      .patch(`/api/garments/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ material: 'Silk' });
    expect(patched.body.material).toBe('Silk');
  });

  it('transitions laundry status', async () => {
    const auth = await register();
    const token = auth.body.token;
    const g = await request(app)
      .post('/api/garments')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Pleated Trousers', category: 'bottoms', primaryColor: 'Beige' });
    const updated = await request(app)
      .patch(`/api/laundry/${g.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'IN_LAUNDRY' });
    expect(updated.body.laundryStatus).toBe('IN_LAUNDRY');
  });

  it('generates outfits without laundry garments', async () => {
    const auth = await register();
    const token = auth.body.token;
    await request(app).post('/api/garments').set('Authorization', `Bearer ${token}`).send({ name: 'Clean Top', category: 'tops', primaryColor: 'White' });
    const dirty = await request(app).post('/api/garments').set('Authorization', `Bearer ${token}`).send({ name: 'Dirty Top', category: 'tops', primaryColor: 'Black' });
    await request(app).patch(`/api/laundry/${dirty.body.id}`).set('Authorization', `Bearer ${token}`).send({ status: 'IN_LAUNDRY' });
    await request(app).post('/api/garments').set('Authorization', `Bearer ${token}`).send({ name: 'Clean Bottom', category: 'bottoms', primaryColor: 'Blue' });
    const gen = await request(app)
      .post('/api/outfits/generate')
      .set('Authorization', `Bearer ${token}`)
      .send({ moods: ['Confident'], occasion: 'Office' });
    expect(gen.status).toBe(200);
    expect(gen.body.items.length).toBeGreaterThan(0);
    const names = JSON.stringify(gen.body.items);
    expect(names).not.toContain('Dirty Top');
    expect(names).toContain('Clean Top');
  });

  it('flags planner laundry conflicts', async () => {
    const auth = await register();
    const token = auth.body.token;
    const top = await request(app).post('/api/garments').set('Authorization', `Bearer ${token}`).send({ name: 'Silk Shirt', category: 'tops', primaryColor: 'Ivory' });
    const bottom = await request(app).post('/api/garments').set('Authorization', `Bearer ${token}`).send({ name: 'Trousers', category: 'bottoms', primaryColor: 'Beige' });
    const gen = await request(app)
      .post('/api/outfits/generate')
      .set('Authorization', `Bearer ${token}`)
      .send({ moods: ['Professional'], occasion: 'Office' });
    const outfitId = gen.body.items[0].id;
    const event = await request(app)
      .post('/api/planner')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Friday pitch', date: '2026-10-16', occasion: 'Office', outfitId });
    expect(event.body.hasConflict).toBe(false);
    await request(app).patch(`/api/laundry/${bottom.body.id}`).set('Authorization', `Bearer ${token}`).send({ status: 'IN_LAUNDRY' });
    const list = await request(app).get('/api/planner').set('Authorization', `Bearer ${token}`);
    expect(list.body.items[0].hasConflict).toBe(true);
    expect(list.body.items[0].conflictDetails).toMatch(/Trousers/);
    expect(top.body.id).toBeTruthy();
  });
});
