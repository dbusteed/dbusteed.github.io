---
title: Random Password Generator in Rust
tags:
  - Rust
---

I've recently been playing around with the Rust programming language, and thought it'd be fun to put together a simple program that generates a random password.

As a fairly new Rustacean, I spent quite a bit of time on [docs.rs](https://docs.rs/). While poking around in the `rand` crate, I found a `struct` named [Alphanumeric](https://docs.rs/rand/latest/rand/distributions/struct.Alphanumeric.html) that would makes generating a random password super easy...but...because I'm trying to gain more experience in Rust, I'm decided to not to take this approach.

## Project Setup

First, we'll set the project up using `cargo`. I like to build and run the `cargo` boilerplate (which is a simple "Hello, world!" program) to make sure everything is good to go:
```bash
$ cargo new random_password
$ cd random_password
$ cargo run
Hello, world!
```

We're going to need the `rand` crate, so let's add that to the `Cargo.toml` now:
```toml
[dependencies]
rand = "0.8.4"
```

## Random Password

Now we can open up `src/main.rs` and start writing the main logic (now's a good time to delete the "Hello, world!" template). Inside `main()`, we can start by creating a list of characters that we'll use to generate the random password:
```rust
// I'm using the `concat!` macro to 
// avoid overly long lines
let chars: String = concat!(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "abcdefghijklmnopqrstuvwxyz",
    "0123456789",
    "!@#$%&*").to_string();

// take the big string of characters
// and convert it to an array of bytes
let charset: &[u8] = &chars.into_bytes();
```

Now that we have the `charset` defined, we'll need a function to grab a random character from the character array. I'm going to define this above the `main()` function:
```rust
fn get_random_char(charset: &[u8]) -> char {
    let idx = thread_rng().gen_range(0..charset.len());
    
    // the last statement of a Rust function (without
    // a semicolon) is the return value
    charset[idx] as char
}
```

Notice we are using `thread_rng()` function to generate a random number, which means we'll need to add a `use` statement at the top of the file:
```rust
use rand::{Rng, thread_rng};
```

With our function in place, we can generate a random string of characters. Here's what we'll do:
* Define `length` as the number of characters in the password
* Take a range from `0` to `length`
* Map the range to the `get_random_char()` function

```rust
let length: usize = 32;

let pass: String = (0..length)
    .map(|_| get_random_char(&charset))
    .collect();

println!("{}", pass);
```

Great! Let's give this a run and see if it works:
```bash
$ cargo run
Tcq4om%D&Ht9rdYW&2KNafSi4DoIcrrC
```

## Add Command Line Args

That's a great start, but let's add some extra functionality. It would be nice if we could dynamically set the `length` variable via a command line argument. Let's give it a shot.

First, we'll need to add the `std::env` module to read the script arguments. Let's add that to the top of the script:
```rust
use std::env;
```

Next, we'll want to keep some sort of default value for the `length` so that the length argument is optional. I'll set this as `const` above the function definitions:
```rust
const DEFAULT_LENGTH: usize = 32;
```

Now let's initialize the `length` and the `args` vector. This can go somewhere in the `main()` function (but before the `pass` expression):
```rust
let length: usize;
let args: Vec<String> = env::args().collect();
```

Perfect, now we just need to parse the arguments to see if a length arg was passed to the script. There are probably more robust ways to parse args, but for this use-case a simple `match` statement will work just fine. It's important to remember that the script name is the first argument, so we're looking for cases when there are two args (the script name and the length):
```rust
length = match args.len() {
    // if we have 2 args, then enter another
    // match that attempts to parse arg to 
    // an number. if that fails, just use 
    // the default value
    2 => match args[1].trim().parse() {
        Ok(num) => num,
        Err(_) => DEFAULT_LENGTH
    },

    // for everything else, use the default
    _ => DEFAULT_LENGTH,
};
```

Since the `pass` expression is already using `length`, that's all we need do! Let's give it a try:
```bash
$ cargo build
$ ./target/debug/random_password     # use the default
fe34ubt6JfMxTUNR@iUAK7TJtroiuuuT
$ ./target/debug/random_password 10  # 10 chars
Y2f8ByeLLh
```

Looks good! Checkout the full code listing below

## Full Listing
```rust
use std::env;
use rand::{Rng, thread_rng};

const DEFAULT_LENGTH: usize = 32;

fn get_random_char(charset: &[u8]) -> char {
    let idx = thread_rng().gen_range(0..charset.len());
    charset[idx] as char
}

fn main() {
    let characters: String = concat!(
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        "abcdefghijklmnopqrstuvwxyz",
        "0123456789",
        "!@#$%&*").to_string();
    let charset: &[u8] = &characters.into_bytes();

    let length: usize;
    let args: Vec<String> = env::args().collect();
    
    length = match args.len() {
        2 => match args[1].trim().parse() {
            Ok(num) => num,
            Err(_) => DEFAULT_LENGTH
        },
        _ => DEFAULT_LENGTH,
    };

    let pass: String = (0..length)
        .map(|_| get_random_char(&charset))
        .collect();
    println!("{}", pass);
}
```