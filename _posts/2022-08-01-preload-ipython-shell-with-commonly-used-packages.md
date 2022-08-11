---
title: Preload IPython Shell with Commonly Used Packages
tags:
  - Python
  - Linux
---

The more I've used Python, the more I've come to rely on it for ad-hoc computation and other miscellaneous tasks. This "unstructured" approach to programming is aided by interpreted languages, which have some sort of "interactive shell" or [REPL](https://en.wikipedia.org/wiki/Read%E2%80%93eval%E2%80%93print_loop).

The majority of my ad-hoc tasks revolves around data processing, specifically testing APIs (hitting endpoints and transforming responses), so 99% of the time open [IPython](https://ipython.readthedocs.io/en/stable/) I start the session with importing `pandas` and `requests`. Despite IPython's useful history-enabled autocomplete feature, writing these import statements time and time again is a little bothersome.

*If only there was way to automatically import certain Python packages when starting the interactive shell...* **well there is!**

## Part 1: Using the `-c` and `-i` options

Most binaries/executables have options that can be specified when invoking the command, and `ipython` is no different. Consider the following:

```bash
#
# running `ipython` with no options starts the shell
#
$ ipython
...
In [1]: 
```

```bash
#
# running `ipython` with the `-c` command let's us run Python code
#
$ ipython -c "print(2 ** 8)"
256
```

> **NOTE:** The `-c` option works with `python` too, but we'll need to use `ipython` for the final solution.

If we can do a simple `print()` statement with the `-c` option, could we do an `import`?

```bash
#
# this "works", but not as we'd like. after running the `import` statement,
# we are sent back to the terminal prompt instead of the interactive shell
#
$ ipython -c "import requests"
$
```

Luckily, IPython has an `-i` option that will start the interactive shell after running any commands. Let's give that try:

```bash
#
# load a single package
#
$ ipython -c "import requests" -i
...
In [1]: # check if `requests` has been loaded
   ...: requests.__version__
Out[1]: '2.28.1'
```

```bash
#
# load multiple packages
#
$ ipython -c "import requests; import pandas as pd" -i
...
In [1]: requests.__version__
Out[1]: '2.28.1'

In [2]: pd.__version__
Out[2]: '1.3.5'
```

## Part 2: Creating the Shortcut

Now that we're able to preload a package into IPython, we'll want to create a shortcut (otherwise we'd still need to type `import package_name` each time we call `ipython`, which doesn't solve the problem). 

Creating shortcuts (or aliases) will vary depending on your OS/shell, so keep that in mind.

I'm using `zsh` on Linux, so I tend to store my aliases in the aptly named `~/.aliases` file, which is executed by the following block inside my `~/.zshrc` file:

```bash
if [ -f ~/.aliases ]; then
  source ~/.aliases
fi
```

With that configuration squared away, all we need to do is open `~/.aliases` and add the following:
```bash
alias ipy="ipython -c 'import requests; import pandas as pd' -i"
```

Next, we'll initialize the new alias and confirm it's working:
```bash
$ source ~/.zshrc
$ ipy
...
In [1]: pd.__version__
Out[1]: '1.3.5'
```

## Part 3: Refactoring the Shortcut

The current `ipy` alias works as we'd expect, but it may become annoying to manage, especially if you want to add a lot of packages to your custom preloaded shell.

To clean things up a little, we can create a dedicated dotfile that lists the imports we want, and then extract the contents of this file when defining the alias. That may sound crazy, but it's pretty easy with `*sh` shells.

First, we'll create the dotfile. I named mine `.ipy_imports.py` and wrote out my desired imports as if it were a normal Python file:

```python
import requests
import pandas as pd
```

Next, we'll want to use `cat` to print out the file contents, and `$(...)` embed the `sh` expression in our `alias` (more about shell expansion [here](https://tldp.org/LDP/Bash-Beginners-Guide/html/sect_03_04.html)).

In my case, my final alias looked like this:
```bash
alias ipy="ipython -c '$(cat ~/.ipy_imports.py)' -i"
```

Notice the double-quotes around the entire alias value, and the single-quotes around the `-c` input. With this dotfile in place, we can easily add and remove `import` statements (and other bits of Python code) that we want to run before the interactive shell starts.

## Final Thoughts

Adding a lot of packages to the preload process will result in a slower load time for `ipython`, so be careful not to preload heavy packages unless you are actually using them each time you run your shell.

Another possible approach would be creating multiple aliases with different sets of packages to be preloaded. For example, you may have your goto `ipy` alias which loads standard libraries like `os` and `sys`, but then use `ipy2` to load packages for data science tasks, like `pandas` and `matplotlib`.

Anyway, hopefully this is helpful to somebody cause it's saved me a ton of time already!