var production = process.env.NODE_ENV === 'production';

module.exports = {
    port: production ? 80 : 8080
};
