// packages/shared/src/types/api.types.ts
export interface ApiResponse<T> {
    data: T
    error: null
}

export interface ApiError {
    data: null
    error: {
        message: string
        code: string
    }
}