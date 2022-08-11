---
title: Running Jupyter Notebooks in Cron
tags:
  - Jupyter
  - Python
  - DevOps
---

> **NOTE:** Newer versions of Jupyter include the `execute` subcommand which makes this article a bit deprecated, so keep that in mind!

I often work with Jupyter Notebooks on a remote server via Jupyter Lab, and sometimes need to run a notebook on a regular basis.

In the past, I would convert the notebook to a Python file, and then add that Python file to the crontab. This approach worked okay, but I would need to need to re-convert the notebook if I made any changes. I was also bothered that I needed to keep a `*.ipynb` and `*.py` file for every script. If I had 5 different tasks, my file system would have 5 notebooks and 5 Python scripts. This isn't a big deal, but it slowed me down while looking for the correct file on Jupyter Lab.

I decided to write a simple Bash script that would do the following:
1. Convert the notebook to a Python script
2. Execute the Python script
3. Delete the Python script

The steps are simple, but this Bash script solves the problems mentioned previously:
1. By converting the notebook each time the Bash script runs, any changes made directly to the notebook will take effect
2. By deleting the Python script after execution, the file system stays uncluttered and we only have one copy of the logic

## Run Notebook Script

The script is fairly small, so I'll list the full contents below with comments:
```bash
#!/bin/bash

# check if the 1st argument exists and 
# is a Jupyter Notebook
if [[ -f $1 ]] && [[ $1 == *.ipynb ]]; then
    
    # get the name of the notebook
    nb=$(basename $1)

    # check if a 2nd argument exists and 
    # if it's a valid directory. if so,
    # we'll save the log file here. otherwise
    # we'll write the log to /dev/null
    if [[ ! -z $2 ]] && [[ -d $2 ]]; then
        log_output=$2/"$nb.log"
    else
        log_output=/dev/null
    fi
    
    # 1. convert the script and save in /tmp
    # 2. run the script and redirect the output
    # 3. delete the Python file
    /usr/local/bin/jupyter nbconvert --to script $1 --output /tmp/$nb &> /dev/null &&
        /usr/bin/python3 /tmp/"$nb.py" &>> $log_output &&
        rm /tmp/"$nb.py"
else
    echo "ERROR: please provide a jupyter notebook"
fi
```

I named this file `run_notebook`, and made it executable by running the following command:
```bash
$ chmod +x run_notebook
```

## Scheduling with Cron

After I wrote that nifty Bash script, I could easily run my notebooks on a schedule with cron:
```cron
# runs every day at 6:30
30 6 * * * /home/me/.local/bin/run_notebook scripts/morning_job.ipynb logs/scripts
```

## Notes
* The `run_notebook` script has a few redirects, which help control what the script outputs. When it converts the notebook, we use a `&>` redirect to `/dev/null`, which sends STDOUT and STDERR to "nowhere". We don't really care to see this output, so we use this trick to ignore it. In the next step, we use a `&>>` to **append** STDOUT and STDERR to the log file. The extra `>` is important, otherwise we'd replace the contents of the file each time

