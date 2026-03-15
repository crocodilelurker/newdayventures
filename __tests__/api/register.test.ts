import { expect, test, vi, describe } from 'vitest'
import { POST } from '@/app/api/auth/register/route'
import dbConnect from '@/lib/mongodb'
import { User } from '@/lib/models/User'

// Mock dependencies
vi.mock('@/lib/mongodb', () => ({
    default: vi.fn(),
}))

vi.mock('@/lib/models/User', () => ({
    User: {
        findOne: vi.fn(),
        create: vi.fn(),
    },
}))

describe('POST /api/auth/register', () => {
    test('returns 400 if required fields are missing', async () => {
        const req = new Request('http://localhost:3000/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name: 'Test' }),
        })

        const res = await POST(req)
        expect(res.status).toBe(400)
        const data = await res.json()
        expect(data.message).toContain('Missing required fields')
    })
    
    test('returns 400 if password is too short', async () => {
        const req = new Request('http://localhost:3000/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name: 'Test', email: 'test@example.com', password: '123' }),
        })

        const res = await POST(req)
        expect(res.status).toBe(400)
    })
})
