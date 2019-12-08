type Result = {
    code: number,
    data?: Array<any>,
    msg: string
}

function isArray(data) {
    return Object.prototype.toString.call(data) === "[object Array]"
}

export function getSuccessResult(result: Object = {}): Result {
    return {
        code: 0, data: [], msg: '',
        ...result
    }
}

export function getErrorResult(e): Result {
    const { details } = e || {}
    let msg = ""
    if (isArray(details) && (details[0] || {}).message) {
        msg = details[0].message
    }
    return {
        code: 1, data: [], msg,
    }
}