import { describe, expect, test } from "bun:test"
import { spawnSync } from "node:child_process"
import { join } from "node:path"

function sendMcpMessage(message: unknown): { stdout: string; stderr: string; exitCode: number | null } {
  const json = JSON.stringify(message)
  const input = `Content-Length: ${Buffer.byteLength(json)}\r\n\r\n${json}`
  const proc = spawnSync("bun", ["run", "bin/check-notebook-mcp.ts"], {
    cwd: process.cwd(),
    input,
    encoding: "utf8",
    timeout: 10000,
  })
  return {
    stdout: proc.stdout,
    stderr: proc.stderr,
    exitCode: proc.status,
  }
}

function parseMcpResponses(output: string): unknown[] {
  const responses: unknown[] = []
  let buffer = output
  while (true) {
    const headerEnd = buffer.indexOf("\r\n\r\n")
    if (headerEnd === -1) break
    const header = buffer.slice(0, headerEnd)
    const match = header.match(/Content-Length:\s*(\d+)/i)
    if (!match) break
    const length = parseInt(match[1], 10)
    const jsonStart = headerEnd + 4
    const jsonEnd = jsonStart + length
    const json = buffer.slice(jsonStart, jsonEnd)
    try {
      responses.push(JSON.parse(json))
    } catch {
      // ignore invalid JSON
    }
    buffer = buffer.slice(jsonEnd)
  }
  return responses
}

describe("check-notebook mcp server", () => {
  test("responds to initialize", () => {
    const result = sendMcpMessage({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: { protocolVersion: "2024-11-05", capabilities: {} },
    })
    expect(result.exitCode).toBe(0)
    const responses = parseMcpResponses(result.stdout)
    const init = responses.find((r: any) => r.id === 1)
    expect(init).toBeDefined()
    expect((init as any).result.protocolVersion).toBe("2024-11-05")
    expect((init as any).result.serverInfo.name).toBe("program-notebook")
  })

  test("lists check_notebook tool", () => {
    const init = JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: { protocolVersion: "2024-11-05", capabilities: {} },
    })
    const toolsList = JSON.stringify({ jsonrpc: "2.0", id: 2, method: "tools/list" })
    const input =
      `Content-Length: ${Buffer.byteLength(init)}\r\n\r\n${init}` +
      `Content-Length: ${Buffer.byteLength(toolsList)}\r\n\r\n${toolsList}`
    const proc = spawnSync("bun", ["run", "bin/check-notebook-mcp.ts"], {
      cwd: process.cwd(),
      input,
      encoding: "utf8",
      timeout: 10000,
    })
    const responses = parseMcpResponses(proc.stdout)
    const tools = responses.find((r: any) => r.id === 2)
    expect(tools).toBeDefined()
    const toolNames = (tools as any).result.tools.map((t: any) => t.name)
    expect(toolNames).toContain("check_notebook")
  })

  test("calls check_notebook tool", () => {
    const init = JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: { protocolVersion: "2024-11-05", capabilities: {} },
    })
    const call = JSON.stringify({
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: { name: "check_notebook", arguments: {} },
    })
    const input =
      `Content-Length: ${Buffer.byteLength(init)}\r\n\r\n${init}` +
      `Content-Length: ${Buffer.byteLength(call)}\r\n\r\n${call}`
    const proc = spawnSync("bun", ["run", "bin/check-notebook-mcp.ts"], {
      cwd: process.cwd(),
      input,
      encoding: "utf8",
      timeout: 10000,
    })
    const responses = parseMcpResponses(proc.stdout)
    const callResponse = responses.find((r: any) => r.id === 3)
    expect(callResponse).toBeDefined()
    const text = (callResponse as any).result.content[0].text
    expect(text).toContain("<program-notebook-status>")
  })
})
