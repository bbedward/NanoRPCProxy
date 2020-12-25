import fs from "fs";

class MockResponse {
    statusCode: number | null = null
    jsonResponse: any | null = null

    status(statusCode: number): MockResponse {
        this.statusCode = statusCode
        return this;
    }
    json(json: any): MockResponse {
        this.jsonResponse = json
        return this;
    }
}

const filePath = 'settings.json';

beforeAll(() => {
    fs.copyFileSync(`${filePath}.default`, filePath, )
})

test('processRequest should fail at unreachable node', async () => {
    process.env.OVERRIDE_USE_HTTP = 'false'
    const proxy = require('../proxy')

    let body = {
        action: 'block_info'
    }
    let request: any = {}
    let mockResponse: MockResponse = new MockResponse()

    await proxy.processRequest(body, request, mockResponse)
    expect(mockResponse.statusCode).toBe(500)
    expect(mockResponse.jsonResponse).toStrictEqual({
        error: 'Error: Connection error: FetchError: request to http://[::1]:7076/ failed, reason: connect ECONNREFUSED ::1:7076'
    })
})

test('processRequest should fail on invalid command', async () => {
    process.env.OVERRIDE_USE_HTTP = 'false'
    const proxy = require('../proxy')

    let body = {
        action: 'not_supported_command'
    }
    let request: any = {}
    let mockResponse: MockResponse = new MockResponse()

    await proxy.processRequest(body, request, mockResponse)
    expect(mockResponse.statusCode).toBe(500)
    expect(mockResponse.jsonResponse).toStrictEqual({
        error: 'Action not_supported_command not allowed'
    })
})

afterAll(() => {
    fs.unlinkSync(filePath)
})