const express = require("express");
const app = express();
const { createProxyMiddleware } = require("http-proxy-middleware");
const rateLimit = require("express-rate-limit")
require("dotenv").config();

const limiter = rateLimit({
    windowMs: 15*60*1000,
    max:3000,
})
const port = process.env.PORT || 5050;

app.use(limiter);
app.get("/",(req,res)=>{
    res.send("Proxy サーバー")
})

app.use("/corona-tracker-world-data", (req,res,next) => {
    createProxyMiddleware({
        target:  process.env.BASE_API_URL_CORONA_WORLD,
        changeOrigin: true,
        pathRewrite: {
            [`^/corona-tracker-world-data`]: "",
        },
    })(req, res, next)
} )

app.listen(port, ()=>{
    console.log(`Listening on localhost port ${port}`)
})

module.exports = app;

// http://localhost:5050/corona-tracker-world-data
