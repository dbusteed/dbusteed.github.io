---
title: Setup Jupyter Lab on a Remote Server (with HTTPS!)
tags:
  - Jupyter
  - Python
  - system administration
---

Jupyter Lab is an awesome tool for data science workflows and is super easy to run locally. But...getting it setup on a remote server (which allows for remote access from anywhere, collaboration with team members, and the ability to access different compute resources) can be a bit more involved.

> **NOTE:** This walkthrough assumes some basic experience with Linux

## Step 1: Setup Server

> Skip this step if you already have a server where you're ready to add Jupyter Lab.

For this demo, I've decided to use Linode ([or should I say Akamai?](https://www.linode.com/blog/linode/a-bold-new-approach-to-the-cloud/)). I like Linode because it's cheap and super easy to use.

I created a 2 GB machine with a shared CPU running Ubuntu 22.04 LTS. Choose whatever specs you want, but if you want to follow along I suggest sticking with Ubuntu 22 (otherwise you'll need to adjust the steps).

After the machine is initialized and running, I `ssh`-ed into the new server from my host machine's terminal. It's good practice to update the system before making changes, so I did that as soon as I logged in:

```bash
$ apt update && apt upgrade -y
```

> **NOTE:** I'm setting everything up as the `root` user. If you do otherwise, be sure to add `sudo` for the appropriate commands, etc

## Step 2: Setup Python

Ubuntu 22.04 ships with Python 3.10, so need to install! But we will need `pip` to manage our Python modules, so go ahead and install what with `apt`:

```bash
$ apt install python3-pip
```

## Step 3: Setup Jupyter

Now that we have `pip`, we can install Jupyter Lab:

```bash
$ pip3 install jupyterlab
```

You can test your Jupyter installation by running `jupyter --help`. If you see a list of available Jupyter commands, then you're ready for the next step.

If we were running on our local machine, we could end here, but since we're setting this up on a remote server that we want to access via the internet, we need to setup some additional configuration.

First, we generate the configuration file with the following command:

```bash
$ jupyter lab --generate-config
```

This creates a config file in the `.jupyter` folder named `jupyter_lab_config.py`.

Open that up with `vim`, `nano`, or through an even more friendly approach like [VS Code's SSH extension](https://code.visualstudio.com/docs/remote/ssh). I'm going to use Vim:

```bash
$ vim .jupyter/jupyter_lab_config.py
```

Make the following changes to the file by uncommenting the relevant sections and updating the value:

```python
# allow all origins and IPs
c.ServerApp.allow_origin = '*'
c.ServerApp.ip = '0.0.0.0'

# choose any port you'd like, 8888 is common for Jupyter
c.ServerApp.port = 8888

# optional, i'm using this since i only plan
# on using the root user on this server
c.ServerApp.allow_root = True
```

Next, we're going to restrict access to the Jupyter Lab instance with a password:

```bash
$ jupyter lab password
```

And just like that, Jupyter Lab is setup! Give it try by starting Jupyter Lab then navigating to the IP address of your machine (with the port number).

From your server:
```bash
$ jupyter lab
```

From your host machine's browser:
```
Navigate to http://11.22.33.44:8888 (insert your IP address)
```

You should see a Jupyter logo with a password field. After entering your password, you'll be in Jupyter Lab!

## Step 4: Setup HTTPS (optional)

Adding HTTPS to your setup ensures that data transferred to and from your Jupyter instance is encrypted. Some web browsers will also show warnings on HTTP sites, so it's HTTPS is also a nice-to-have for usability.

### Step 4A: Setup DNS

We can't setup HTTPS for our website until we get a domain name and setup DNS. There's a lot of approaches to this, but my favorite is using [https://freedns.afraid.org/](https://freedns.afraid.org/). The site may look a little outdated, but it's a super easy (and free!) way to create domain name that points to your IP.

After creating an account, you can click on the "subdomains" menu option. From here, you can select an existing domain (like "moooo.com"), and create your own subdomain for free (for example "dev-server.moooo.com"). Aside from that, the only real step here is adding your IP address as an [A record](https://en.wikipedia.org/wiki/List_of_DNS_record_types#A).

### Step 4B: Setup NGINX

We'll continue to keep things simple and free by using LetsEncrypt to obtain our SSL certificates. To do this, we'll use a tool called `certbot` which handles that process for us. But before we can do that, we'll need a web server, so let's install NGINX:

```bash
$ apt install nginx
```

You can confirm NGINX is running by running the following command:

```bash
$ service nginx status
```

Now's a good time to test our DNS setup. Instead of going to your IP address in your host machine's browser, navigate to your DNS name (don't go to port 8888 just yet). You should see the default "welcome to NGINX" page.

### Step 4C: Setup Certbot

Now that NGINX is setup, we can download `certbot` and get our certificates. The Certbot website gives customized instructions given your OS and web server, so check that out if your using something other than Ubuntu + NGINX.

I'll briefly list the steps I took (full instructions [here](https://certbot.eff.org/instructions?ws=nginx&os=ubuntufocal)):
* Confirm `snap` is installed (should be installed by default)
* Update `snap`
* `snap install --classic certbot`
* `certbot --nginx`
  * Add my full DNS name (not just the subdomain) when prompted

After that, I went back to my web browser and navigated to the HTTPS version of my domain and was again able to see the NGINX welcome page, but this time with HTTPS.


### Step 4D: Setup Reverse Proxy

Final step, almost there! When we run Jupyter on the server locally, it is running on HTTP, which means we still won't be able to access Jupyter via HTTPS without setting up a [reverse proxy](https://en.wikipedia.org/wiki/Reverse_proxy). Luckily, NGINX makes this very easy! This also gives us a chance to add a unique path to our domain that points to Jupyter, which can be handy if we decide to run other UIs from this server.

As the root user, we are going to edit the following file: `/etc/nginx/sites-enabled/default`

The NGINX configuration file is split into different `server { }` blocks. Find the one that has the `listen 443 ssl;` directive, and add the following lines to that server block:

```
location /jupyter/ {
    proxy_pass http://localhost:8888;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection upgrade;
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

You can adjust the `location` name and the port number if you used something different. The other steps will handle the reverse proxy.

Our URL to Jupyter will look something like `https://server-name.domain.me/jupyter`, which means we need to edit one last setting in our Jupyter config file. Open `.jupyter/jupyter_lab_config.py` and make the following change:

```python
c.ServerApp.base_url = '/jupyter/'
```

We need to reset NGINX since we made changes to the config file:

```bash
$ nginx -t && nginx -s reload
```

I prefer to run Jupyter in the background so I can continue to run other tasks on the server, so the final step is to start Jupyter using `nohup`:

```bash
$ nohup jupyter lab &> /dev/null &
```

## Conclusion

That's it! Hopefully you didn't run into any issues and can jump into working with Jupyter and collaborating with others.