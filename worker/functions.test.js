const { fib } = require('./functions')

test("Testing fib of 6 should give me 8", () => {
    expect(fib(6)).toBe(8)
});

test("Fib 0 should be 0", () => {
    expect(fib(0)).toBe(0)
});

test("Fib 20 should be 6765", () => {
    expect(fib(20)).toBe(6765)
});