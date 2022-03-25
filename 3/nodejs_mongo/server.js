import app from "./src/app.js"                                              // Get app exported from app.js

const port = process.env.PORT || 3000

app.listen(port, () => {                                                    // Start server
    console.log('Servidor escutando na porta http://localhost:' + port);
})