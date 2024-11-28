const errorTemplate = (res, err, message, status) => {
    return res.status(status).json({
        error: {
            message: message,
            status: err.status
        }
    })
}

module.exports = errorTemplate