const errorHandler = (err, req,res, next) => {
    console.error(err.stack);

    console.log(res);

    const statusCode = res.statusCode === 200? 500: res.statusCode;

    res.status(statusCode).json({
        message:err.message || "Server Error"
    });

    module.exports = errorHandler;
}