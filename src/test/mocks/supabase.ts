import { vi } from 'vitest'
import type { Database } from '@/types/supabase'

type TableName = keyof Database['public']['Tables']
type TableRow<T extends TableName> = Database['public']['Tables'][T]['Row']
type TableInsert<T extends TableName> = Database['public']['Tables'][T]['Insert']
type TableUpdate<T extends TableName> = Database['public']['Tables'][T]['Update']

interface QueryBuilder<T> {
  select: (columns?: string) => QueryBuilder<T>
  insert: (data: Partial<T> | Partial<T>[]) => QueryBuilder<T>
  update: (data: Partial<T>) => QueryBuilder<T>
  delete: () => QueryBuilder<T>
  eq: (column: string, value: any) => QueryBuilder<T>
  neq: (column: string, value: any) => QueryBuilder<T>
  gt: (column: string, value: any) => QueryBuilder<T>
  gte: (column: string, value: any) => QueryBuilder<T>
  lt: (column: string, value: any) => QueryBuilder<T>
  lte: (column: string, value: any) => QueryBuilder<T>
  like: (column: string, pattern: string) => QueryBuilder<T>
  ilike: (column: string, pattern: string) => QueryBuilder<T>
  is: (column: string, value: any) => QueryBuilder<T>
  in: (column: string, values: any[]) => QueryBuilder<T>
  contains: (column: string, value: any) => QueryBuilder<T>
  containedBy: (column: string, value: any) => QueryBuilder<T>
  order: (column: string, options?: { ascending?: boolean }) => QueryBuilder<T>
  limit: (count: number) => QueryBuilder<T>
  single: () => Promise<{ data: T | null; error: any }>
  maybeSingle: () => Promise<{ data: T | null; error: any }>
  then: (onfulfilled?: (value: any) => any) => Promise<any>
}

interface RealtimeChannel {
  on: (event: string, filter: any, callback: (payload: any) => void) => RealtimeChannel
  subscribe: (callback?: (status: string) => void) => RealtimeChannel
  unsubscribe: () => Promise<void>
}

interface AuthStateChange {
  event: 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'USER_UPDATED'
  session: any
}

interface SupabaseMockConfig {
  tables: Map<string, TableMockConfig<any>>
  rpcs: Map<string, RPCMockConfig>
  auth: AuthMockConfig
  realtime: RealtimeMockConfig
}

interface TableMockConfig<T> {
  data: T[]
  errors: {
    select?: Error
    insert?: Error
    update?: Error
    delete?: Error
  }
  filters: Array<(data: T[], column: string, value: any) => T[]>
}

interface RPCMockConfig {
  response: any
  error?: Error
}

interface AuthMockConfig {
  user: any
  session: any
  error?: Error
  stateChanges: AuthStateChange[]
}

interface RealtimeMockConfig {
  channels: Map<string, RealtimeChannelConfig>
}

interface RealtimeChannelConfig {
  events: Array<{ event: string; payload: any; delay?: number }>
}

export class SupabaseMock {
  private config: SupabaseMockConfig

  constructor(config: Partial<SupabaseMockConfig> = {}) {
    this.config = {
      tables: config.tables || new Map(),
      rpcs: config.rpcs || new Map(),
      auth: config.auth || { user: null, session: null, stateChanges: [] },
      realtime: config.realtime || { channels: new Map() },
    }
  }

  from<T extends TableName>(table: T): QueryBuilder<TableRow<T>> {
    const tableConfig = this.config.tables.get(table) || { data: [], errors: {}, filters: [] }
    let result = [...tableConfig.data]
    let operation: 'select' | 'insert' | 'update' | 'delete' = 'select'
    let updateData: any = null
    let insertData: any = null

    const builder: QueryBuilder<TableRow<T>> = {
      select: (columns?: string) => {
        operation = 'select'
        if (tableConfig.errors.select) {
          return builder
        }
        return builder
      },
      insert: (data: any) => {
        operation = 'insert'
        insertData = Array.isArray(data) ? data : [data]
        return builder
      },
      update: (data: any) => {
        operation = 'update'
        updateData = data
        return builder
      },
      delete: () => {
        operation = 'delete'
        return builder
      },
      eq: (column: string, value: any) => {
        result = result.filter((item: any) => item[column] === value)
        return builder
      },
      neq: (column: string, value: any) => {
        result = result.filter((item: any) => item[column] !== value)
        return builder
      },
      gt: (column: string, value: any) => {
        result = result.filter((item: any) => item[column] > value)
        return builder
      },
      gte: (column: string, value: any) => {
        result = result.filter((item: any) => item[column] >= value)
        return builder
      },
      lt: (column: string, value: any) => {
        result = result.filter((item: any) => item[column] < value)
        return builder
      },
      lte: (column: string, value: any) => {
        result = result.filter((item: any) => item[column] <= value)
        return builder
      },
      like: (column: string, pattern: string) => {
        const regex = new RegExp(pattern.replace(/%/g, '.*').replace(/_/g, '.'), 'g')
        result = result.filter((item: any) => regex.test(item[column]))
        return builder
      },
      ilike: (column: string, pattern: string) => {
        const regex = new RegExp(pattern.replace(/%/g, '.*').replace(/_/g, '.'), 'gi')
        result = result.filter((item: any) => regex.test(item[column]))
        return builder
      },
      is: (column: string, value: any) => {
        result = result.filter((item: any) => item[column] === value)
        return builder
      },
      in: (column: string, values: any[]) => {
        result = result.filter((item: any) => values.includes(item[column]))
        return builder
      },
      contains: (column: string, value: any) => {
        result = result.filter((item: any) => {
          if (Array.isArray(item[column])) {
            return item[column].includes(value)
          }
          return false
        })
        return builder
      },
      containedBy: (column: string, value: any) => {
        result = result.filter((item: any) => {
          if (Array.isArray(value) && Array.isArray(item[column])) {
            return item[column].every((v: any) => value.includes(v))
          }
          return false
        })
        return builder
      },
      order: (column: string, options?: { ascending?: boolean }) => {
        const ascending = options?.ascending !== false
        result.sort((a: any, b: any) => {
          if (ascending) {
            return a[column] > b[column] ? 1 : -1
          }
          return a[column] < b[column] ? 1 : -1
        })
        return builder
      },
      limit: (count: number) => {
        result = result.slice(0, count)
        return builder
      },
      single: async () => {
        const error = tableConfig.errors[operation as keyof typeof tableConfig.errors]
        if (error) {
          return { data: null, error }
        }

        if (operation === 'insert' && insertData) {
          const newData = insertData[0]
          tableConfig.data.push(newData)
          return { data: newData, error: null }
        }

        if (operation === 'update' && updateData) {
          const index = tableConfig.data.findIndex((item: any) => 
            result.includes(item)
          )
          if (index !== -1) {
            Object.assign(tableConfig.data[index], updateData)
            return { data: tableConfig.data[index], error: null }
          }
        }

        if (operation === 'delete') {
          const toDelete = result[0]
          const index = tableConfig.data.indexOf(toDelete)
          if (index !== -1) {
            tableConfig.data.splice(index, 1)
          }
          return { data: toDelete, error: null }
        }

        return { data: result[0] || null, error: null }
      },
      maybeSingle: async () => {
        return builder.single()
      },
      then: async (onfulfilled?: (value: any) => any) => {
        const error = tableConfig.errors[operation as keyof typeof tableConfig.errors]
        if (error) {
          return Promise.resolve({ data: null, error })
        }

        if (operation === 'insert' && insertData) {
          tableConfig.data.push(...insertData)
          return Promise.resolve({ data: insertData, error: null })
        }

        if (operation === 'update' && updateData) {
          result.forEach((item: any) => {
            const index = tableConfig.data.indexOf(item)
            if (index !== -1) {
              Object.assign(tableConfig.data[index], updateData)
            }
          })
          return Promise.resolve({ data: result, error: null })
        }

        if (operation === 'delete') {
          result.forEach((item: any) => {
            const index = tableConfig.data.indexOf(item)
            if (index !== -1) {
              tableConfig.data.splice(index, 1)
            }
          })
          return Promise.resolve({ data: result, error: null })
        }

        const response = { data: result, error: null }
        return onfulfilled ? onfulfilled(response) : response
      },
    }

    return builder
  }

  rpc(fnName: string, params?: any) {
    const rpcConfig = this.config.rpcs.get(fnName)
    if (!rpcConfig) {
      return Promise.resolve({ data: null, error: new Error(`RPC function ${fnName} not mocked`) })
    }
    if (rpcConfig.error) {
      return Promise.resolve({ data: null, error: rpcConfig.error })
    }
    return Promise.resolve({ data: rpcConfig.response, error: null })
  }

  channel(name: string): RealtimeChannel {
    const channelConfig = this.config.realtime.channels.get(name) || { events: [] }
    const listeners = new Map<string, Array<(payload: any) => void>>()

    return {
      on: (event: string, filter: any, callback: (payload: any) => void) => {
        const key = `${event}:${JSON.stringify(filter)}`
        if (!listeners.has(key)) {
          listeners.set(key, [])
        }
        listeners.get(key)!.push(callback)
        return this.channel(name)
      },
      subscribe: (callback?: (status: string) => void) => {
        if (callback) {
          callback('SUBSCRIBED')
        }
        
        // Emit configured events
        channelConfig.events.forEach(({ event, payload, delay = 0 }) => {
          setTimeout(() => {
            listeners.forEach((callbacks, key) => {
              if (key.startsWith(event)) {
                callbacks.forEach(cb => cb(payload))
              }
            })
          }, delay)
        })
        
        return this.channel(name)
      },
      unsubscribe: async () => {
        listeners.clear()
      },
    }
  }

  get auth() {
    const authConfig = this.config.auth
    const stateChangeListeners: Array<(data: AuthStateChange) => void> = []

    return {
      getSession: vi.fn(() => 
        Promise.resolve({ 
          data: { session: authConfig.session }, 
          error: authConfig.error 
        })
      ),
      getUser: vi.fn(() => 
        Promise.resolve({ 
          data: { user: authConfig.user }, 
          error: authConfig.error 
        })
      ),
      signInWithOtp: vi.fn(({ email }: { email: string }) => {
        if (authConfig.error) {
          return Promise.resolve({ data: null, error: authConfig.error })
        }
        return Promise.resolve({ data: { user: null, session: null }, error: null })
      }),
      signOut: vi.fn(() => {
        authConfig.user = null
        authConfig.session = null
        stateChangeListeners.forEach(listener => 
          listener({ event: 'SIGNED_OUT', session: null })
        )
        return Promise.resolve({ error: null })
      }),
      onAuthStateChange: vi.fn((callback: (event: string, session: any) => void) => {
        const listener = (data: AuthStateChange) => callback(data.event, data.session)
        stateChangeListeners.push(listener)
        
        // Emit configured state changes
        authConfig.stateChanges.forEach(change => {
          setTimeout(() => callback(change.event, change.session), 0)
        })
        
        return {
          data: {
            subscription: {
              unsubscribe: vi.fn(() => {
                const index = stateChangeListeners.indexOf(listener)
                if (index > -1) {
                  stateChangeListeners.splice(index, 1)
                }
              }),
            },
          },
        }
      }),
    }
  }

  // Helper methods for configuration
  setTableData<T extends TableName>(table: T, data: TableRow<T>[]) {
    if (!this.config.tables.has(table)) {
      this.config.tables.set(table, { data: [], errors: {}, filters: [] })
    }
    this.config.tables.get(table)!.data = data
  }

  setTableError<T extends TableName>(table: T, operation: 'select' | 'insert' | 'update' | 'delete', error: Error) {
    if (!this.config.tables.has(table)) {
      this.config.tables.set(table, { data: [], errors: {}, filters: [] })
    }
    this.config.tables.get(table)!.errors[operation] = error
  }

  setRPCResponse(fnName: string, response: any, error?: Error) {
    this.config.rpcs.set(fnName, { response, error })
  }

  setAuthUser(user: any, session: any) {
    this.config.auth.user = user
    this.config.auth.session = session
  }

  setAuthError(error: Error) {
    this.config.auth.error = error
  }

  addRealtimeEvent(channel: string, event: string, payload: any, delay?: number) {
    if (!this.config.realtime.channels.has(channel)) {
      this.config.realtime.channels.set(channel, { events: [] })
    }
    this.config.realtime.channels.get(channel)!.events.push({ event, payload, delay })
  }
}

// Export a function to create a new mock instance
export function createSupabaseMock(config?: Partial<SupabaseMockConfig>) {
  return new SupabaseMock(config)
}