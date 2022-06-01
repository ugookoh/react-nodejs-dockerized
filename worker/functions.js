
function fib(index) {
    if (index == 0) return 0;
    if (index == 1) return 1;

    return fib(index - 2) + fib(index - 1)
}

module.exports = { fib }