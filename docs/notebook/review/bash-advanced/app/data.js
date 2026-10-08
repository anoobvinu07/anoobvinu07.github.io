window.SHEET = {
 "sections": [
  {
   "id": "orient",
   "num": "01",
   "title": "Getting oriented",
   "lede": "Where you are, what the prompt is telling you, and how to get help without leaving the terminal."
  },
  {
   "id": "nav",
   "num": "02",
   "title": "File navigation",
   "lede": "Moving around the filesystem, making and removing things, and finding files on a shared cluster."
  },
  {
   "id": "view",
   "num": "03",
   "title": "Core utilities",
   "lede": "Look inside files without opening an editor: cat, head, tail, wc, and the small tools you chain them with."
  },
  {
   "id": "redirect",
   "num": "04",
   "title": "Redirection & pipes",
   "lede": "Every command has three streams. Redirection decides where they come from and where they go."
  },
  {
   "id": "quote",
   "num": "05",
   "title": "Quoting rules",
   "lede": "Quotes decide what the shell expands and where it splits words. Most mysterious bugs start here."
  }
 ],
 "cards": [
  {
   "id": "prompt",
   "sec": "orient",
   "cmd": "prompt",
   "title": "Read the prompt",
   "summary": "The prompt tells you who you are, which machine you are on, and your current directory. On a cluster, the hostname matters: login nodes are shared and are not for heavy computation.",
   "syntax": "[user@host directory]$",
   "ex": [
    {
     "code": "hostname",
     "note": "Which node am I on? login01 = shared login node; c0423 = compute node.",
     "out": "login01.cluster.edu"
    },
    {
     "code": "whoami",
     "note": "Your username, which is also the owner of your $HOME.",
     "out": "ada"
    },
    {
     "code": "echo $HOME $SCRATCH",
     "note": "Your home and scratch locations. $SCRATCH is site-specific; check your cluster docs.",
     "out": "/home/ada /scratch/ada"
    }
   ],
   "tips": [
    "`~` at the end of the prompt means you are in your home directory.",
    "A `>` prompt instead of `$` means the shell is waiting for you to finish something, usually an unclosed quote. Press Ctrl-C to bail out."
   ],
   "warn": [
    "Do not run long or memory-heavy jobs on a login node. Request a compute node with `srun --pty bash` or submit with `sbatch` (Slurm)."
   ]
  },
  {
   "id": "help",
   "sec": "orient",
   "cmd": "man / --help",
   "title": "Get help",
   "summary": "Every standard command documents itself. `--help` gives a quick summary; `man` gives the full manual page.",
   "syntax": "man COMMAND   |   COMMAND --help   |   type COMMAND",
   "ex": [
    {
     "code": "head --help",
     "note": "Short usage summary for GNU tools.",
     "out": ""
    },
    {
     "code": "man wc",
     "note": "Full manual. Space = next page, b = back, /word = search, q = quit.",
     "out": ""
    },
    {
     "code": "type cd ls",
     "note": "Is it a builtin, an alias, or a program on disk?",
     "out": "cd is a shell builtin\nls is aliased to `ls --color=auto'"
    },
    {
     "code": "module avail samtools",
     "note": "On HPC, software is often hidden behind environment modules.",
     "out": ""
    }
   ],
   "tips": [
    "`help cd` works for shell builtins that have no man page."
   ],
   "warn": []
  },
  {
   "id": "keys",
   "sec": "orient",
   "cmd": "shortcuts",
   "title": "Keyboard shortcuts",
   "summary": "These save more time than any alias. Tab completion also prevents typos in long filenames.",
   "syntax": "Tab · Ctrl-C · Ctrl-D · Ctrl-R · Ctrl-A / Ctrl-E · ↑ ↓",
   "ex": [
    {
     "code": "# Tab        complete a file or command name (press twice to list options)\n# Ctrl-C     cancel the running command / abandon the current line\n# Ctrl-D     end of input; on an empty prompt it logs you out\n# Ctrl-R     search backwards through history\n# Ctrl-A / E jump to start / end of line\n# Ctrl-L     clear the screen\n# Up / Down  previous / next command",
     "note": "Reference, not something to run.",
     "out": ""
    },
    {
     "code": "history | tail -n 20",
     "note": "Your last 20 commands.",
     "out": ""
    },
    {
     "code": "!!",
     "note": "Re-run the previous command. `sudo !!` is the classic, but you rarely have sudo on a cluster.",
     "out": ""
    }
   ],
   "tips": [],
   "warn": [
    "Ctrl-S freezes terminal output in many terminals. If your screen stops responding, press Ctrl-Q."
   ]
  },
  {
   "id": "pwd",
   "sec": "nav",
   "cmd": "pwd",
   "title": "Print working directory",
   "summary": "Shows the absolute path of the directory you are in. Run it whenever you are unsure where a relative path will point.",
   "syntax": "pwd",
   "ex": [
    {
     "code": "pwd",
     "note": "",
     "out": "/scratch/ada/project/fastq"
    }
   ],
   "tips": [],
   "warn": []
  },
  {
   "id": "ls",
   "sec": "nav",
   "cmd": "ls",
   "title": "List directory contents",
   "summary": "Lists files. Flags combine: `-lh` is the same as `-l -h`.",
   "syntax": "ls [-l] [-a] [-h] [-t] [-r] [PATH...]",
   "ex": [
    {
     "code": "ls -lh",
     "note": "Long listing with human-readable sizes (K, M, G).",
     "out": "-rw-r--r-- 1 ada lab 1.2G Oct  2 09:14 S01_R1.fastq.gz"
    },
    {
     "code": "ls -la",
     "note": "Include hidden dotfiles such as .bashrc.",
     "out": ""
    },
    {
     "code": "ls -ltr",
     "note": "Sort by time, oldest first, so the newest file ends up next to your prompt.",
     "out": ""
    },
    {
     "code": "ls *.vcf.gz",
     "note": "Glob: the shell expands the pattern before ls ever runs.",
     "out": ""
    },
    {
     "code": "ls -d */",
     "note": "Directories only.",
     "out": ""
    }
   ],
   "tips": [
    "Read permissions as owner / group / others: `rw-r--r--` means you can write, everyone else can only read."
   ],
   "warn": [
    "`ls` on a directory with millions of files can hang the shared filesystem. Use `ls -f | head` or `find . -maxdepth 1 | head`."
   ]
  },
  {
   "id": "cd",
   "sec": "nav",
   "cmd": "cd",
   "title": "Change directory",
   "summary": "Moves you to another directory. With no argument, it takes you home.",
   "syntax": "cd [PATH]",
   "ex": [
    {
     "code": "cd /scratch/$USER/project",
     "note": "Absolute path: starts with /, works from anywhere.",
     "out": ""
    },
    {
     "code": "cd data/raw",
     "note": "Relative path: resolved from where you are now.",
     "out": ""
    },
    {
     "code": "cd ..",
     "note": "Up one level. `cd ../..` goes up two.",
     "out": ""
    },
    {
     "code": "cd ~",
     "note": "Home. Plain `cd` does the same.",
     "out": ""
    },
    {
     "code": "cd -",
     "note": "Back to the previous directory, like a TV remote's 'last channel'.",
     "out": ""
    },
    {
     "code": "cd \"My Data\"",
     "note": "Quote names that contain spaces.",
     "out": ""
    }
   ],
   "tips": [
    "`.` is the current directory, `..` is the parent, `~` is your home, `/` is the filesystem root."
   ],
   "warn": []
  },
  {
   "id": "paths",
   "sec": "nav",
   "cmd": "paths",
   "title": "Absolute vs relative paths",
   "summary": "An absolute path starts at `/` and means the same thing everywhere. A relative path depends on your current directory, which is why scripts that work interactively can fail inside a batch job.",
   "syntax": "/abs/path   rel/path   ./file   ../sibling   ~/file",
   "ex": [
    {
     "code": "realpath reads.fq",
     "note": "Turn a relative path into an absolute one.",
     "out": "/scratch/ada/project/reads.fq"
    },
    {
     "code": "cd \"$SLURM_SUBMIT_DIR\"",
     "note": "Inside a Slurm job script: start where you ran sbatch, so relative paths behave.",
     "out": ""
    },
    {
     "code": "./run_qc.sh",
     "note": "Run a script in the current directory. The ./ is required because . is not on $PATH.",
     "out": ""
    }
   ],
   "tips": [],
   "warn": [
    "`~` is not expanded inside quotes: `\"~/data\"` is a literal tilde. Use `\"$HOME/data\"`."
   ]
  },
  {
   "id": "mkdir",
   "sec": "nav",
   "cmd": "mkdir",
   "title": "Make directories",
   "summary": "Creates directories. `-p` creates parent directories as needed and does not complain if the directory already exists.",
   "syntax": "mkdir [-p] DIR...",
   "ex": [
    {
     "code": "mkdir results",
     "note": "",
     "out": ""
    },
    {
     "code": "mkdir -p results/qc/fastqc logs",
     "note": "Nested path plus a second directory in one call.",
     "out": ""
    },
    {
     "code": "mkdir -p analysis/{raw,trimmed,aligned}",
     "note": "Brace expansion creates three sibling directories.",
     "out": ""
    }
   ],
   "tips": [],
   "warn": []
  },
  {
   "id": "cp",
   "sec": "nav",
   "cmd": "cp",
   "title": "Copy files",
   "summary": "Copies files. Directories need `-r`. With several sources, the last argument must be a directory.",
   "syntax": "cp [-r] [-i] [-v] SOURCE... DEST",
   "ex": [
    {
     "code": "cp config.yaml config.yaml.bak",
     "note": "Quick backup before editing.",
     "out": ""
    },
    {
     "code": "cp -r ref/ /scratch/$USER/ref/",
     "note": "Copy a directory tree.",
     "out": ""
    },
    {
     "code": "cp -i *.vcf archive/",
     "note": "-i asks before overwriting anything.",
     "out": ""
    },
    {
     "code": "rsync -avh --progress data/ /scratch/$USER/data/",
     "note": "For large transfers, rsync resumes and shows progress.",
     "out": ""
    }
   ],
   "tips": [],
   "warn": [
    "`cp` overwrites the destination silently unless you use `-i` or `-n`."
   ]
  },
  {
   "id": "mv",
   "sec": "nav",
   "cmd": "mv",
   "title": "Move or rename",
   "summary": "Renaming and moving are the same operation. Moving within one filesystem is instant regardless of size.",
   "syntax": "mv [-i] [-n] SOURCE... DEST",
   "ex": [
    {
     "code": "mv sample1.fq S01_R1.fq",
     "note": "Rename.",
     "out": ""
    },
    {
     "code": "mv *.log logs/",
     "note": "Move many files into a directory.",
     "out": ""
    },
    {
     "code": "mv -n new.txt old.txt",
     "note": "-n never overwrites an existing file.",
     "out": ""
    }
   ],
   "tips": [],
   "warn": [
    "`mv a.txt b.txt` replaces b.txt without asking if it exists."
   ]
  },
  {
   "id": "rm",
   "sec": "nav",
   "cmd": "rm",
   "title": "Remove files",
   "summary": "Deletes files permanently. There is no recycle bin on a cluster, and scratch is usually not backed up.",
   "syntax": "rm [-i] [-r] [-f] PATH...",
   "ex": [
    {
     "code": "rm tmp.txt",
     "note": "",
     "out": ""
    },
    {
     "code": "rm -i *.bam",
     "note": "Confirm each deletion.",
     "out": ""
    },
    {
     "code": "rm -r old_run/",
     "note": "Remove a directory and everything in it.",
     "out": ""
    },
    {
     "code": "ls *.tmp && rm *.tmp",
     "note": "Preview what a glob matches before deleting it.",
     "out": ""
    },
    {
     "code": "rmdir empty_dir",
     "note": "Removes only empty directories: a safe default.",
     "out": ""
    }
   ],
   "tips": [],
   "warn": [
    "`rm -rf $DIR/` with an empty `$DIR` becomes `rm -rf /`. Quote and guard: `rm -rf \"${DIR:?not set}\"/`.",
    "A stray space is fatal: `rm -rf ./ data` deletes the current directory, not ./data."
   ]
  },
  {
   "id": "find",
   "sec": "nav",
   "cmd": "find",
   "title": "Find files",
   "summary": "Recursively searches a directory tree by name, type, size, or age. Quote the pattern so find, not the shell, does the matching.",
   "syntax": "find PATH [-name 'PATTERN'] [-type f|d] [-size +N] [-mtime -N]",
   "ex": [
    {
     "code": "find . -name '*.fastq.gz'",
     "note": "Every gzipped FASTQ below here.",
     "out": ""
    },
    {
     "code": "find /scratch/$USER -type f -size +10G",
     "note": "Large files that are eating your quota.",
     "out": ""
    },
    {
     "code": "find . -name '*.log' -mtime -1",
     "note": "Logs modified in the last 24 hours.",
     "out": ""
    },
    {
     "code": "find . -maxdepth 1 -type d",
     "note": "Immediate subdirectories only.",
     "out": ""
    },
    {
     "code": "find . -name '*.tmp' -print",
     "note": "Always run with -print first; only then swap it for -delete.",
     "out": ""
    }
   ],
   "tips": [],
   "warn": [
    "Unquoted `find . -name *.txt` breaks when the current directory already contains a .txt file, because the shell expands it first."
   ]
  },
  {
   "id": "du",
   "sec": "nav",
   "cmd": "du / df / quota",
   "title": "Disk usage",
   "summary": "Clusters enforce quotas. When writes start failing, these show where your space went.",
   "syntax": "du -sh PATH   |   df -h PATH   |   quota -s",
   "ex": [
    {
     "code": "du -sh *",
     "note": "Size of each item in the current directory.",
     "out": ""
    },
    {
     "code": "du -sh * | sort -h",
     "note": "Same, sorted smallest to largest.",
     "out": ""
    },
    {
     "code": "df -h $HOME",
     "note": "Free space on the filesystem holding your home.",
     "out": ""
    },
    {
     "code": "quota -s",
     "note": "Your quota on many systems. Some sites use `myquota`, `lfs quota`, or a custom command.",
     "out": ""
    }
   ],
   "tips": [],
   "warn": []
  },
  {
   "id": "ln",
   "sec": "nav",
   "cmd": "ln -s",
   "title": "Symbolic links",
   "summary": "A shortcut that points at another path. Useful for linking shared reference genomes into your project without copying them.",
   "syntax": "ln -s TARGET LINK_NAME",
   "ex": [
    {
     "code": "ln -s /shared/refs/Pinus_taeda_v2.fa ref.fa",
     "note": "ref.fa now points to the shared genome.",
     "out": ""
    },
    {
     "code": "ls -l ref.fa",
     "note": "",
     "out": "ref.fa -> /shared/refs/Pinus_taeda_v2.fa"
    }
   ],
   "tips": [
    "The argument order matches `cp`: what exists first, then the new name."
   ],
   "warn": []
  },
  {
   "id": "cat",
   "sec": "view",
   "cmd": "cat",
   "title": "Concatenate & print",
   "summary": "Prints whole files to the screen, or joins several files into one stream. Best for small files.",
   "syntax": "cat [-n] [-A] FILE...",
   "ex": [
    {
     "code": "cat samples.txt",
     "note": "Print a short file.",
     "out": ""
    },
    {
     "code": "cat -n samples.txt",
     "note": "Number every line.",
     "out": ""
    },
    {
     "code": "cat part1.fq part2.fq > combined.fq",
     "note": "Join files. Order is preserved.",
     "out": ""
    },
    {
     "code": "cat -A sheet.csv | head",
     "note": "Show hidden characters: `^M$` at line ends means Windows line endings.",
     "out": ""
    }
   ],
   "tips": [
    "Gzipped FASTQ files can be concatenated directly: `cat a.fq.gz b.fq.gz > ab.fq.gz` produces a valid gzip file."
   ],
   "warn": [
    "Running `cat` on a 50 GB file floods your terminal. Use `head` or `less` instead.",
    "`cat` with no filename waits for keyboard input. Press Ctrl-D (end) or Ctrl-C (cancel)."
   ]
  },
  {
   "id": "head",
   "sec": "view",
   "cmd": "head",
   "title": "First lines",
   "summary": "Shows the start of a file, 10 lines by default. Ideal for peeking at headers and file formats.",
   "syntax": "head [-n N] [-c BYTES] FILE...",
   "ex": [
    {
     "code": "head data.csv",
     "note": "First 10 lines.",
     "out": ""
    },
    {
     "code": "head -n 4 reads.fastq",
     "note": "One FASTQ record is exactly 4 lines.",
     "out": ""
    },
    {
     "code": "head -n -1 data.csv",
     "note": "GNU only: everything except the last line.",
     "out": ""
    },
    {
     "code": "zcat reads.fastq.gz | head -n 8",
     "note": "Peek inside a gzipped file without decompressing it to disk.",
     "out": ""
    },
    {
     "code": "head -n 1 *.csv",
     "note": "Several files: head prints a ==> name <== banner for each.",
     "out": ""
    }
   ],
   "tips": [],
   "warn": [
    "`gzip: stdout: Broken pipe` after `zcat | head` is harmless: head simply stopped reading early."
   ]
  },
  {
   "id": "tail",
   "sec": "view",
   "cmd": "tail",
   "title": "Last lines",
   "summary": "Shows the end of a file. `-f` keeps following it as it grows, which is how you watch a running job's log.",
   "syntax": "tail [-n N] [-n +K] [-f] FILE",
   "ex": [
    {
     "code": "tail -n 20 slurm-123456.out",
     "note": "Last 20 lines of a job log.",
     "out": ""
    },
    {
     "code": "tail -f slurm-123456.out",
     "note": "Live view. Ctrl-C stops watching; it does not stop the job.",
     "out": ""
    },
    {
     "code": "tail -n +2 data.csv",
     "note": "Start at line 2, i.e. drop the header.",
     "out": ""
    },
    {
     "code": "head -n 200 data.csv | tail -n 1",
     "note": "Print exactly line 200.",
     "out": ""
    }
   ],
   "tips": [],
   "warn": []
  },
  {
   "id": "less",
   "sec": "view",
   "cmd": "less",
   "title": "Page through a file",
   "summary": "Opens a file one screen at a time without loading it all into memory. Safe on huge files.",
   "syntax": "less [-S] [-N] FILE",
   "ex": [
    {
     "code": "less -S variants.vcf",
     "note": "-S turns off line wrapping; use ← → to scroll wide VCF rows.",
     "out": ""
    },
    {
     "code": "zless reads.fastq.gz",
     "note": "Page through a gzipped file.",
     "out": ""
    },
    {
     "code": "# inside less:\n#   Space / b   page down / up\n#   g / G       start / end\n#   /pattern    search forward, n = next match\n#   q           quit",
     "note": "Keys to remember.",
     "out": ""
    }
   ],
   "tips": [],
   "warn": []
  },
  {
   "id": "wc",
   "sec": "view",
   "cmd": "wc",
   "title": "Count lines, words, bytes",
   "summary": "Counts lines (`-l`), words (`-w`), and bytes (`-c`). Strictly, `-l` counts newline characters.",
   "syntax": "wc [-l] [-w] [-c] FILE...",
   "ex": [
    {
     "code": "wc -l samples.txt",
     "note": "Filename is printed after the count.",
     "out": "96 samples.txt"
    },
    {
     "code": "wc -l < samples.txt",
     "note": "Read from stdin instead: you get just the number, handy in scripts.",
     "out": "96"
    },
    {
     "code": "echo $(( $(zcat reads.fq.gz | wc -l) / 4 ))",
     "note": "Number of reads in a FASTQ: lines divided by 4.",
     "out": ""
    },
    {
     "code": "grep -vc '^#' variants.vcf",
     "note": "Count variant rows, skipping header lines (grep -c counts matches).",
     "out": ""
    },
    {
     "code": "wc -l *.txt",
     "note": "Several files get a 'total' line at the end.",
     "out": ""
    }
   ],
   "tips": [],
   "warn": [
    "If the last line has no trailing newline, `wc -l` reports one fewer line than you expect."
   ]
  },
  {
   "id": "sort",
   "sec": "view",
   "cmd": "sort / uniq",
   "title": "Sort and deduplicate",
   "summary": "`sort` orders lines; `uniq` collapses adjacent duplicates. Because uniq only looks at neighbors, you almost always sort first.",
   "syntax": "sort [-n] [-h] [-r] [-k N] [-t SEP] [-u] FILE   |   uniq [-c] [-d]",
   "ex": [
    {
     "code": "sort -k2,2n coords.tsv",
     "note": "Sort numerically on column 2 only.",
     "out": ""
    },
    {
     "code": "sort -t, -k3,3 data.csv",
     "note": "Comma-separated: sort on the third field.",
     "out": ""
    },
    {
     "code": "cut -f1 calls.tsv | sort | uniq -c | sort -rn",
     "note": "Frequency table of column 1, most common first.",
     "out": ""
    },
    {
     "code": "sort -u ids.txt",
     "note": "Sort and drop duplicates in one step.",
     "out": ""
    }
   ],
   "tips": [],
   "warn": [
    "Without `-n`, sort is alphabetical: 10 comes before 9."
   ]
  },
  {
   "id": "cut",
   "sec": "view",
   "cmd": "cut",
   "title": "Extract columns",
   "summary": "Pulls out fields from delimited text. The default delimiter is Tab.",
   "syntax": "cut -f LIST [-d DELIM] FILE",
   "ex": [
    {
     "code": "cut -f1,2 variants.tsv",
     "note": "Columns 1 and 2 of a tab-separated file.",
     "out": ""
    },
    {
     "code": "cut -d, -f3- data.csv",
     "note": "Comma-separated, column 3 to the end.",
     "out": ""
    },
    {
     "code": "grep -v '^##' variants.vcf | cut -f1-5 | head",
     "note": "Peek at CHROM POS ID REF ALT.",
     "out": ""
    }
   ],
   "tips": [],
   "warn": [
    "cut cannot handle quoted CSV fields that contain commas. Use `csvcut` or R/Python for real CSV."
   ]
  },
  {
   "id": "grep",
   "sec": "view",
   "cmd": "grep",
   "title": "Search text",
   "summary": "Prints lines that match a pattern. Quote the pattern in single quotes so the shell leaves it alone.",
   "syntax": "grep [-i] [-v] [-c] [-n] [-w] [-E] [-r] 'PATTERN' FILE...",
   "ex": [
    {
     "code": "grep 'ERROR' slurm-*.out",
     "note": "Which job logs mention an error?",
     "out": ""
    },
    {
     "code": "grep -c '^>' contigs.fa",
     "note": "Count sequences in a FASTA (lines starting with >).",
     "out": ""
    },
    {
     "code": "grep -v '^#' variants.vcf | head",
     "note": "-v inverts: skip header lines.",
     "out": ""
    },
    {
     "code": "grep -n -i 'oom' job.log",
     "note": "Case-insensitive, with line numbers.",
     "out": ""
    },
    {
     "code": "grep -E 'S0[1-5]_' samples.txt",
     "note": "Extended regular expressions.",
     "out": ""
    },
    {
     "code": "zgrep -c 'PASS' calls.vcf.gz",
     "note": "Search inside a gzipped file.",
     "out": ""
    }
   ],
   "tips": [],
   "warn": [
    "`grep '>' file` is fine. `grep > file` (no quotes) truncates file and grep waits for input."
   ]
  },
  {
   "id": "zcat",
   "sec": "view",
   "cmd": "zcat / gzip",
   "title": "Compressed files",
   "summary": "Most sequencing data arrives gzipped. The z-tools let you read it without unpacking to disk.",
   "syntax": "zcat FILE.gz   |   gzip [-k] FILE   |   gunzip FILE.gz",
   "ex": [
    {
     "code": "zcat reads.fq.gz | head -n 4",
     "note": "First FASTQ record.",
     "out": ""
    },
    {
     "code": "gzip -k results.tsv",
     "note": "-k keeps the original file.",
     "out": ""
    },
    {
     "code": "gunzip -t reads.fq.gz && echo OK",
     "note": "Test archive integrity after a transfer.",
     "out": ""
    },
    {
     "code": "tar -xzf archive.tar.gz",
     "note": "Extract a .tar.gz (x = extract, z = gzip, f = file).",
     "out": ""
    }
   ],
   "tips": [],
   "warn": []
  },
  {
   "id": "streams",
   "sec": "redirect",
   "cmd": "0 1 2",
   "title": "The three standard streams",
   "summary": "Every process starts with three file descriptors: 0 = stdin (input, normally the keyboard), 1 = stdout (normal output), 2 = stderr (errors and warnings). Both 1 and 2 normally go to your terminal, which is why they look identical until you redirect one.",
   "syntax": "0 stdin   1 stdout   2 stderr",
   "ex": [
    {
     "code": "ls real.txt missing.txt > out.txt",
     "note": "The listing goes to out.txt; the error still appears on screen because it is stderr.",
     "out": "ls: cannot access 'missing.txt': No such file or directory"
    }
   ],
   "tips": [
    "Slurm writes both streams to `slurm-JOBID.out` by default. Use `#SBATCH -o` and `#SBATCH -e` to split them."
   ],
   "warn": []
  },
  {
   "id": "gt",
   "sec": "redirect",
   "cmd": ">",
   "title": "Write stdout to a file",
   "summary": "Sends stdout into a file, creating it if needed and truncating it to zero length first if it exists.",
   "syntax": "command > FILE",
   "ex": [
    {
     "code": "ls *.bam > bam_list.txt",
     "note": "",
     "out": ""
    },
    {
     "code": "set -o noclobber",
     "note": "Protect yourself: now `>` refuses to overwrite existing files. Use `>|` to force.",
     "out": ""
    }
   ],
   "tips": [],
   "warn": [
    "The file is truncated before the command runs. `sort data.txt > data.txt` leaves you with an empty file."
   ]
  },
  {
   "id": "gtgt",
   "sec": "redirect",
   "cmd": ">>",
   "title": "Append stdout",
   "summary": "Adds to the end of a file instead of replacing it.",
   "syntax": "command >> FILE",
   "ex": [
    {
     "code": "echo \"$(date) started $SAMPLE\" >> run.log",
     "note": "Build up a log across many commands.",
     "out": ""
    },
    {
     "code": "for f in *.csv; do tail -n +2 \"$f\" >> merged.csv; done",
     "note": "Append every file minus its header.",
     "out": ""
    }
   ],
   "tips": [],
   "warn": [
    "Rerunning an appending script doubles the output. Clear the file first with `> merged.csv` if needed."
   ]
  },
  {
   "id": "lt",
   "sec": "redirect",
   "cmd": "<",
   "title": "Read stdin from a file",
   "summary": "Feeds a file into a command's standard input. The command sees data but not a filename.",
   "syntax": "command < FILE",
   "ex": [
    {
     "code": "wc -l < samples.txt",
     "note": "Prints only the count, with no filename.",
     "out": "96"
    },
    {
     "code": "while read -r id; do echo \"processing $id\"; done < samples.txt",
     "note": "Loop over lines of a file.",
     "out": ""
    }
   ],
   "tips": [],
   "warn": []
  },
  {
   "id": "err",
   "sec": "redirect",
   "cmd": "2> / 2>&1 / &>",
   "title": "Redirect errors",
   "summary": "Put a file descriptor number before the operator to redirect that stream. `2>&1` means 'make stderr go wherever stdout currently goes'.",
   "syntax": "cmd 2> err.txt   |   cmd > all.txt 2>&1   |   cmd &> all.txt",
   "ex": [
    {
     "code": "bwa mem ref.fa r1.fq r2.fq > aln.sam 2> bwa.log",
     "note": "Data to one file, messages to another: the standard bioinformatics pattern.",
     "out": ""
    },
    {
     "code": "./pipeline.sh > run.log 2>&1",
     "note": "Both streams into one file. Order matters: file first, then 2>&1.",
     "out": ""
    },
    {
     "code": "./pipeline.sh &> run.log",
     "note": "Bash shorthand for the line above.",
     "out": ""
    },
    {
     "code": "find / -name '*.fa' 2> /dev/null",
     "note": "Discard the permission-denied noise.",
     "out": ""
    }
   ],
   "tips": [],
   "warn": [
    "`cmd 2>&1 > file` is not the same as `cmd > file 2>&1`. Redirections run left to right; in the first form stderr copies stdout while it still points at the terminal."
   ]
  },
  {
   "id": "pipe",
   "sec": "redirect",
   "cmd": "|",
   "title": "Pipes",
   "summary": "Connects one command's stdout to the next command's stdin. Nothing touches the disk in between.",
   "syntax": "cmd1 | cmd2 | cmd3",
   "ex": [
    {
     "code": "zcat reads.fq.gz | head -n 400000 | gzip > subset.fq.gz",
     "note": "Take the first 100,000 reads.",
     "out": ""
    },
    {
     "code": "grep -v '^#' calls.vcf | cut -f1 | sort | uniq -c",
     "note": "Variants per chromosome.",
     "out": ""
    },
    {
     "code": "cmd 2>&1 | less",
     "note": "Pipes only carry stdout. Merge stderr first if you want to page through errors too.",
     "out": ""
    },
    {
     "code": "set -o pipefail",
     "note": "In scripts: make a pipeline fail if any stage fails, not just the last one.",
     "out": ""
    }
   ],
   "tips": [],
   "warn": []
  },
  {
   "id": "tee",
   "sec": "redirect",
   "cmd": "tee",
   "title": "Split output: screen and file",
   "summary": "Copies stdin to a file and to stdout, so you can watch output and save it at the same time.",
   "syntax": "cmd | tee [-a] FILE",
   "ex": [
    {
     "code": "./qc.sh 2>&1 | tee qc.log",
     "note": "Watch it live and keep a log.",
     "out": ""
    },
    {
     "code": "./qc.sh | tee -a qc.log",
     "note": "-a appends instead of overwriting.",
     "out": ""
    }
   ],
   "tips": [],
   "warn": []
  },
  {
   "id": "devnull",
   "sec": "redirect",
   "cmd": "/dev/null",
   "title": "The bit bucket",
   "summary": "A special file that discards anything written to it and is always empty when read.",
   "syntax": "cmd > /dev/null 2>&1",
   "ex": [
    {
     "code": "command -v samtools > /dev/null || echo 'load the samtools module first'",
     "note": "Check that a tool exists, without printing its path.",
     "out": ""
    },
    {
     "code": "grep -q 'PASS' calls.vcf && echo found",
     "note": "grep -q is a cleaner way to stay silent.",
     "out": ""
    }
   ],
   "tips": [],
   "warn": [
    "Silencing stderr also hides real errors. Do it only when you know what you are throwing away."
   ]
  },
  {
   "id": "heredoc",
   "sec": "redirect",
   "cmd": "<< EOF",
   "title": "Here-documents",
   "summary": "Feeds a block of inline text to a command's stdin. Quoting the delimiter (`'EOF'`) turns off variable expansion inside the block.",
   "syntax": "cmd << EOF ... EOF   |   cmd << 'EOF' ... EOF",
   "ex": [
    {
     "code": "cat > samples.txt << EOF\nS01\nS02\nS03\nEOF",
     "note": "Write a small file without opening an editor.",
     "out": ""
    },
    {
     "code": "cat > job.sh << 'EOF'\n#!/bin/bash\n#SBATCH -t 01:00:00\necho \"running on $HOSTNAME\"\nEOF",
     "note": "Quoted delimiter: $HOSTNAME is written literally and expanded later, on the compute node.",
     "out": ""
    },
    {
     "code": "grep -c x <<< \"$SEQ\"",
     "note": "Here-string: feed a single variable as stdin.",
     "out": ""
    }
   ],
   "tips": [],
   "warn": [
    "The closing EOF must be alone on its line with no leading spaces (unless you use `<<-` with tabs)."
   ]
  },
  {
   "id": "procsub",
   "sec": "redirect",
   "cmd": "<( )",
   "title": "Process substitution",
   "summary": "Treats a command's output as if it were a file. Great for tools that demand filenames.",
   "syntax": "cmd <(other_cmd) <(other_cmd)",
   "ex": [
    {
     "code": "diff <(sort a.txt) <(sort b.txt)",
     "note": "Compare two files ignoring order.",
     "out": ""
    },
    {
     "code": "comm -12 <(sort ids_a.txt) <(sort ids_b.txt)",
     "note": "IDs present in both lists.",
     "out": ""
    },
    {
     "code": "paste <(cut -f1 a.tsv) <(cut -f3 b.tsv)",
     "note": "Glue columns from two files side by side.",
     "out": ""
    }
   ],
   "tips": [],
   "warn": [
    "Bash only. It fails in `sh` with `syntax error near unexpected token '('`."
   ]
  },
  {
   "id": "single",
   "sec": "quote",
   "cmd": "'...'",
   "title": "Single quotes: fully literal",
   "summary": "Everything between single quotes is taken exactly as typed. No variables, no globs, no backslash escapes. You cannot put a single quote inside single quotes.",
   "syntax": "'literal text'",
   "ex": [
    {
     "code": "echo 'Cost: $5 * 3'",
     "note": "",
     "out": "Cost: $5 * 3"
    },
    {
     "code": "grep -E '^chr[0-9]+\\s' file.bed",
     "note": "The safe default for regular expressions.",
     "out": ""
    },
    {
     "code": "awk '{print $1}' data.tsv",
     "note": "Single quotes protect awk's own $1 from the shell.",
     "out": ""
    },
    {
     "code": "echo 'It'\\''s done'",
     "note": "To include a quote: close, add an escaped quote, reopen.",
     "out": "It's done"
    }
   ],
   "tips": [],
   "warn": []
  },
  {
   "id": "double",
   "sec": "quote",
   "cmd": "\"...\"",
   "title": "Double quotes: expand, but do not split",
   "summary": "Variables (`$VAR`) and command substitution (`$(...)`) still expand, but the result stays one word, and globs are not expanded. Inside, a backslash only escapes `$`, backtick, `\"`, and `\\`.",
   "syntax": "\"text with $VAR and $(cmd)\"",
   "ex": [
    {
     "code": "FILE=\"my reads.fq\"\nwc -l \"$FILE\"",
     "note": "Without quotes, wc would look for two files: my and reads.fq.",
     "out": ""
    },
    {
     "code": "echo \"Home is $HOME, today is $(date +%F)\"",
     "note": "",
     "out": "Home is /home/ada, today is 2026-10-05"
    },
    {
     "code": "echo \"Price: \\$5\"",
     "note": "Escape a literal dollar.",
     "out": "Price: $5"
    }
   ],
   "tips": [
    "Rule of thumb: always double-quote variable expansions, `\"$var\"`, unless you specifically want splitting."
   ],
   "warn": []
  },
  {
   "id": "backslash",
   "sec": "quote",
   "cmd": "\\",
   "title": "Backslash escapes",
   "summary": "Outside quotes, a backslash makes the next single character literal. At the end of a line it continues the command onto the next line.",
   "syntax": "\\CHAR   |   long command \\",
   "ex": [
    {
     "code": "ls My\\ Data/",
     "note": "Escape a space (Tab completion does this for you).",
     "out": ""
    },
    {
     "code": "sbatch --job-name=qc \\\n       --time=02:00:00 \\\n       --mem=8G run.sh",
     "note": "Split a long command over lines.",
     "out": ""
    }
   ],
   "tips": [],
   "warn": [
    "A space after the trailing backslash breaks line continuation, and the error is almost invisible."
   ]
  },
  {
   "id": "vars",
   "sec": "quote",
   "cmd": "$VAR ${VAR}",
   "title": "Variables",
   "summary": "Assign with no spaces around `=`. Use braces when the name is followed by characters that could be part of a name.",
   "syntax": "NAME=value   \"$NAME\"   \"${NAME}_suffix\"",
   "ex": [
    {
     "code": "SAMPLE=S01\necho \"${SAMPLE}_R1.fq\"",
     "note": "Without braces, bash looks for a variable named SAMPLE_R1.",
     "out": "S01_R1.fq"
    },
    {
     "code": "OUT=${OUT:-results}",
     "note": "Default value if OUT is unset or empty.",
     "out": ""
    },
    {
     "code": "f=reads.fastq.gz\necho \"${f%.fastq.gz}\"",
     "note": "Strip a suffix: a clean way to build output names.",
     "out": "reads"
    },
    {
     "code": "export THREADS=8",
     "note": "export makes the variable visible to programs you launch.",
     "out": ""
    }
   ],
   "tips": [],
   "warn": [
    "`NAME = value` (with spaces) runs a command called NAME. Bash replies `NAME: command not found`."
   ]
  },
  {
   "id": "cmdsub",
   "sec": "quote",
   "cmd": "$( )",
   "title": "Command substitution",
   "summary": "Runs a command and pastes its output in place. Prefer `$(...)` over old-style backticks because it nests and reads clearly.",
   "syntax": "\"$(command)\"",
   "ex": [
    {
     "code": "N=$(wc -l < samples.txt)\necho \"There are $N samples\"",
     "note": "",
     "out": "There are 96 samples"
    },
    {
     "code": "mkdir \"run_$(date +%Y%m%d)\"",
     "note": "Date-stamped output directory.",
     "out": ""
    },
    {
     "code": "echo \"Job $SLURM_JOB_ID on $(hostname)\"",
     "note": "",
     "out": ""
    }
   ],
   "tips": [],
   "warn": []
  },
  {
   "id": "glob",
   "sec": "quote",
   "cmd": "* ? [ ]",
   "title": "Globs (wildcards)",
   "summary": "Unquoted `*`, `?`, and `[...]` are expanded by the shell into matching filenames before the command runs. Quoting turns them back into literal characters.",
   "syntax": "*  any string   ?  one char   [abc]  one of   {a,b}  brace list",
   "ex": [
    {
     "code": "ls S0?_R1.fq.gz",
     "note": "S01 to S09, but not S10.",
     "out": ""
    },
    {
     "code": "ls *_R[12].fq.gz",
     "note": "Both read pairs.",
     "out": ""
    },
    {
     "code": "echo *.fasta",
     "note": "If nothing matches, bash passes the literal text *.fasta.",
     "out": "*.fasta"
    },
    {
     "code": "echo '*.fasta'",
     "note": "Quoted: never expanded.",
     "out": "*.fasta"
    },
    {
     "code": "for f in *.fq.gz; do echo \"$f\"; done",
     "note": "Loop over files the safe way. Never parse `ls` output.",
     "out": ""
    }
   ],
   "tips": [
    "`{a,b}` brace expansion is not a glob: it always expands, whether or not files exist."
   ],
   "warn": []
  },
  {
   "id": "spaces",
   "sec": "quote",
   "cmd": "spaces",
   "title": "Spaces in filenames",
   "summary": "The shell splits words on spaces. A name like `Field Notes.txt` becomes two arguments unless you quote or escape it. Easiest fix: avoid spaces in names you create.",
   "syntax": "\"Field Notes.txt\"   'Field Notes.txt'   Field\\ Notes.txt",
   "ex": [
    {
     "code": "cat \"Field Notes.txt\"",
     "note": "",
     "out": ""
    },
    {
     "code": "for f in *.txt; do mv \"$f\" \"${f// /_}\"; done",
     "note": "Replace spaces with underscores in every .txt filename.",
     "out": ""
    },
    {
     "code": "find . -name '*.txt' -print0 | xargs -0 wc -l",
     "note": "-print0 and -0 keep odd filenames intact through a pipe.",
     "out": ""
    }
   ],
   "tips": [],
   "warn": []
  },
  {
   "id": "remote",
   "sec": "quote",
   "cmd": "nested",
   "title": "Quoting across ssh & sbatch --wrap",
   "summary": "When a command string is handed to another shell, it is parsed twice: once locally, once remotely. Choose the outer quote type based on where you want variables to expand.",
   "syntax": "ssh host 'cmd $REMOTE_VAR'   |   sbatch --wrap \"cmd $LOCAL_VAR\"",
   "ex": [
    {
     "code": "ssh cluster 'echo $HOSTNAME'",
     "note": "Single quotes: expanded on the remote machine.",
     "out": "login01"
    },
    {
     "code": "ssh cluster \"echo $HOSTNAME\"",
     "note": "Double quotes: expanded locally before sending.",
     "out": "my-laptop"
    },
    {
     "code": "sbatch --wrap=\"gzip -k '$PWD/big file.tsv'\"",
     "note": "Outer double quotes expand $PWD now; inner single quotes protect the space later.",
     "out": ""
    }
   ],
   "tips": [],
   "warn": []
  }
 ],
 "errors": [
  {
   "msg": "command not found",
   "full": "-bash: samtools: command not found",
   "cause": "The program is not on your $PATH. On a cluster this usually means its module is not loaded. It can also be a typo, or a script in the current directory run without ./",
   "fix": "module avail samtools\nmodule load samtools\n./myscript.sh        # not just myscript.sh",
   "tags": "path module typo"
  },
  {
   "msg": "No such file or directory",
   "full": "head: cannot open 'Reads.fq' for reading: No such file or directory",
   "cause": "Wrong path, wrong case (Linux is case-sensitive), or a relative path resolved from a different directory than you thought. Also appears when a glob matches nothing and is passed through literally.",
   "fix": "pwd\nls -l\nrealpath reads.fq",
   "tags": "path case glob"
  },
  {
   "msg": "Permission denied",
   "full": "-bash: ./run.sh: Permission denied",
   "cause": "Either the script lacks the execute bit, or you are trying to write into a directory you do not own (for example a shared reference folder or another user's home).",
   "fix": "chmod +x run.sh\nbash run.sh          # or run it via bash directly\nls -ld /shared/refs  # check directory permissions",
   "tags": "chmod execute write"
  },
  {
   "msg": "Is a directory",
   "full": "cat: results: Is a directory",
   "cause": "You gave a directory where a file was expected.",
   "fix": "ls results/\ncat results/summary.txt",
   "tags": "directory cat"
  },
  {
   "msg": "-r not specified; omitting directory",
   "full": "cp: -r not specified; omitting directory 'ref'",
   "cause": "cp copies files only, unless told to recurse into directories.",
   "fix": "cp -r ref/ backup_ref/",
   "tags": "cp directory recursive"
  },
  {
   "msg": "> prompt that will not go away",
   "full": ">\n>\n>",
   "cause": "The shell is waiting for you to finish an unclosed quote, bracket, or here-document. It is not frozen.",
   "fix": "# Press Ctrl-C to cancel the line, then retype it with balanced quotes\necho \"done\"",
   "tags": "quote ps2 continuation"
  },
  {
   "msg": "unexpected EOF while looking for matching",
   "full": "line 12: unexpected EOF while looking for matching `\"'",
   "cause": "A script has an unclosed quote somewhere above the line reported. Bash only notices at the end of the file.",
   "fix": "bash -n script.sh     # syntax check without running\ngrep -n '\"' script.sh   # find the odd one out",
   "tags": "quote script syntax"
  },
  {
   "msg": "ambiguous redirect",
   "full": "-bash: $OUT: ambiguous redirect",
   "cause": "The redirection target is an unquoted variable that is empty or contains spaces, so it does not expand to exactly one filename.",
   "fix": "echo \"[$OUT]\"         # inspect it\ncmd > \"$OUT\"",
   "tags": "redirect variable quote"
  },
  {
   "msg": "[: too many arguments",
   "full": "-bash: [: too many arguments",
   "cause": "An unquoted variable inside a test contained spaces and was split into several words.",
   "fix": "if [ \"$name\" = \"S01 rep1\" ]; then echo match; fi\n# or use [[ ]] which does not split\nif [[ $name == \"S01 rep1\" ]]; then echo match; fi",
   "tags": "test quote variable"
  },
  {
   "msg": "File is empty after sort/cat/grep",
   "full": "$ sort data.txt > data.txt\n$ wc -l data.txt\n0 data.txt",
   "cause": "The shell truncates the output file before the command starts reading the same file. The data is gone.",
   "fix": "sort data.txt > data.sorted.txt && mv data.sorted.txt data.txt\nsort -o data.txt data.txt     # sort can do it safely itself",
   "tags": "redirect truncate overwrite"
  },
  {
   "msg": "bad interpreter: /bin/bash^M",
   "full": "-bash: ./run.sh: /bin/bash^M: bad interpreter: No such file or directory",
   "cause": "The script was edited on Windows and has CRLF line endings. The invisible \\r becomes part of every line.",
   "fix": "cat -A run.sh | head -n 2   # shows ^M$ at line ends\nsed -i 's/\\r$//' run.sh       # or: dos2unix run.sh",
   "tags": "windows crlf line endings"
  },
  {
   "msg": "event not found",
   "full": "-bash: !nice: event not found",
   "cause": "In interactive bash, `!` inside double quotes triggers history expansion.",
   "fix": "echo 'Job done!nice'     # single quotes\nset +H                   # or turn history expansion off",
   "tags": "quote history bang"
  },
  {
   "msg": "NAME: command not found (on assignment)",
   "full": "-bash: THREADS: command not found",
   "cause": "Spaces around `=` turn a variable assignment into a command named THREADS with arguments `=` and `8`.",
   "fix": "THREADS=8",
   "tags": "variable assignment spaces"
  },
  {
   "msg": "Argument list too long",
   "full": "-bash: /bin/rm: Argument list too long",
   "cause": "A glob such as `*.tmp` expanded to more filenames than the kernel allows in a single command.",
   "fix": "find . -name '*.tmp' -delete\n# or process in batches\nfind . -name '*.fq' -print0 | xargs -0 gzip",
   "tags": "glob xargs find"
  },
  {
   "msg": "Disk quota exceeded",
   "full": "cp: error writing 'big.bam': Disk quota exceeded",
   "cause": "You hit your storage or file-count limit, usually in $HOME, which tends to be small on clusters.",
   "fix": "quota -s\ndu -sh ~/* | sort -h | tail\nmv ~/big_run /scratch/$USER/",
   "tags": "quota storage hpc"
  },
  {
   "msg": "Killed",
   "full": "Killed",
   "cause": "The process was terminated, often for using too much memory on a login node, or (inside a job) for exceeding the memory you requested. Slurm logs show `oom-kill` or `OUT_OF_MEMORY`.",
   "fix": "srun --mem=16G --time=01:00:00 --pty bash   # interactive compute node\nsacct -j JOBID --format=JobID,State,MaxRSS,ReqMem",
   "tags": "memory oom slurm login node"
  },
  {
   "msg": "Terminal hangs after cat or grep",
   "full": "$ cat\n_",
   "cause": "You ran a command that reads stdin without giving it a file, so it is waiting for you to type. Common after a missing filename, or after `grep pattern > file` with no input file.",
   "fix": "# Ctrl-D to send end-of-input, or Ctrl-C to cancel\ngrep 'pattern' input.txt > hits.txt",
   "tags": "stdin hang cat"
  },
  {
   "msg": "gzip: stdout: Broken pipe",
   "full": "gzip: stdout: Broken pipe",
   "cause": "Harmless. `head` or `less` stopped reading early, so the upstream command was told to stop.",
   "fix": "zcat reads.fq.gz 2>/dev/null | head",
   "tags": "pipe gzip head"
  },
  {
   "msg": "syntax error near unexpected token `('",
   "full": "sh: syntax error near unexpected token `('",
   "cause": "You used a bash-only feature, such as `<( )` or arrays, in a script run by `sh`, or you have an unquoted parenthesis in a filename.",
   "fix": "bash script.sh            # not: sh script.sh\n#!/bin/bash                # first line of the script\nls \"sample (copy).txt\"",
   "tags": "bash sh shebang"
  }
 ],
 "quick": [
  {
   "group": "Navigate",
   "rows": [
    {
     "c": "pwd",
     "d": "where am I"
    },
    {
     "c": "ls -lh",
     "d": "list with sizes"
    },
    {
     "c": "cd DIR",
     "d": "go to DIR"
    },
    {
     "c": "cd ..",
     "d": "up one"
    },
    {
     "c": "cd -",
     "d": "previous dir"
    },
    {
     "c": "cd",
     "d": "home"
    },
    {
     "c": "realpath F",
     "d": "absolute path"
    }
   ]
  },
  {
   "group": "Manage",
   "rows": [
    {
     "c": "mkdir -p a/b",
     "d": "make nested dirs"
    },
    {
     "c": "cp -r SRC DST",
     "d": "copy (dirs need -r)"
    },
    {
     "c": "mv OLD NEW",
     "d": "move / rename"
    },
    {
     "c": "rm -i F",
     "d": "delete, ask first"
    },
    {
     "c": "ln -s T L",
     "d": "symlink"
    },
    {
     "c": "find . -name '*.x'",
     "d": "find by name"
    },
    {
     "c": "du -sh *",
     "d": "sizes here"
    }
   ]
  },
  {
   "group": "Inspect",
   "rows": [
    {
     "c": "cat F",
     "d": "print file"
    },
    {
     "c": "head -n N F",
     "d": "first N lines"
    },
    {
     "c": "tail -n N F",
     "d": "last N lines"
    },
    {
     "c": "tail -n +2 F",
     "d": "skip header"
    },
    {
     "c": "tail -f LOG",
     "d": "follow log"
    },
    {
     "c": "less -S F",
     "d": "page, no wrap"
    },
    {
     "c": "wc -l F",
     "d": "count lines"
    }
   ]
  },
  {
   "group": "Filter",
   "rows": [
    {
     "c": "grep 'p' F",
     "d": "matching lines"
    },
    {
     "c": "grep -v 'p'",
     "d": "non-matching"
    },
    {
     "c": "grep -c 'p'",
     "d": "count matches"
    },
    {
     "c": "cut -f1,3",
     "d": "columns (tab)"
    },
    {
     "c": "sort -k2,2n",
     "d": "sort numeric col 2"
    },
    {
     "c": "uniq -c",
     "d": "count adjacent dupes"
    },
    {
     "c": "zcat F.gz",
     "d": "read gzip"
    }
   ]
  },
  {
   "group": "Redirect",
   "rows": [
    {
     "c": "> F",
     "d": "stdout to F (overwrite)"
    },
    {
     "c": ">> F",
     "d": "stdout append"
    },
    {
     "c": "< F",
     "d": "stdin from F"
    },
    {
     "c": "2> F",
     "d": "stderr to F"
    },
    {
     "c": "> F 2>&1",
     "d": "both to F"
    },
    {
     "c": "&> F",
     "d": "both (bash)"
    },
    {
     "c": "a | b",
     "d": "stdout of a into b"
    },
    {
     "c": "| tee F",
     "d": "screen + file"
    },
    {
     "c": "2> /dev/null",
     "d": "discard errors"
    }
   ]
  },
  {
   "group": "Quote",
   "rows": [
    {
     "c": "'...'",
     "d": "literal, nothing expands"
    },
    {
     "c": "\"...\"",
     "d": "expand $ but keep one word"
    },
    {
     "c": "\\x",
     "d": "escape one char"
    },
    {
     "c": "\"$VAR\"",
     "d": "always quote vars"
    },
    {
     "c": "\"${V}_x\"",
     "d": "braces before text"
    },
    {
     "c": "\"$(cmd)\"",
     "d": "insert output"
    },
    {
     "c": "'*.txt'",
     "d": "stop glob expansion"
    }
   ]
  },
  {
   "group": "Keys",
   "rows": [
    {
     "c": "Tab",
     "d": "complete"
    },
    {
     "c": "Ctrl-C",
     "d": "cancel"
    },
    {
     "c": "Ctrl-D",
     "d": "end input / logout"
    },
    {
     "c": "Ctrl-R",
     "d": "search history"
    },
    {
     "c": "Ctrl-A / E",
     "d": "line start / end"
    },
    {
     "c": "q",
     "d": "quit less / man"
    }
   ]
  }
 ],
 "redir": [
  {
   "op": "cmd",
   "label": "no redirection",
   "stdin": "keyboard",
   "stdout": "terminal",
   "stderr": "terminal",
   "note": "By default both output streams land on your screen, interleaved."
  },
  {
   "op": "cmd > out.txt",
   "label": ">",
   "stdin": "keyboard",
   "stdout": "out.txt",
   "stderr": "terminal",
   "note": "stdout goes to the file (truncated first). Errors still show on screen."
  },
  {
   "op": "cmd >> out.txt",
   "label": ">>",
   "stdin": "keyboard",
   "stdout": "out.txt (append)",
   "stderr": "terminal",
   "note": "Same as >, but adds to the end of the file."
  },
  {
   "op": "cmd < in.txt",
   "label": "<",
   "stdin": "in.txt",
   "stdout": "terminal",
   "stderr": "terminal",
   "note": "The command reads its input from the file instead of the keyboard."
  },
  {
   "op": "cmd 2> err.txt",
   "label": "2>",
   "stdin": "keyboard",
   "stdout": "terminal",
   "stderr": "err.txt",
   "note": "Only stderr (fd 2) is captured. Normal output still prints."
  },
  {
   "op": "cmd > out.txt 2> err.txt",
   "label": "> 2>",
   "stdin": "keyboard",
   "stdout": "out.txt",
   "stderr": "err.txt",
   "note": "Split data from diagnostics: the classic aligner pattern."
  },
  {
   "op": "cmd > all.txt 2>&1",
   "label": "> 2>&1",
   "stdin": "keyboard",
   "stdout": "all.txt",
   "stderr": "all.txt",
   "note": "First point stdout at the file, then make stderr a copy of stdout. Both end up in the file."
  },
  {
   "op": "cmd 2>&1 > all.txt",
   "label": "2>&1 > (wrong order)",
   "stdin": "keyboard",
   "stdout": "all.txt",
   "stderr": "terminal",
   "note": "Trap: stderr copied stdout while stdout was still the terminal. Only stdout reaches the file.",
   "trap": true
  },
  {
   "op": "cmd &> all.txt",
   "label": "&>",
   "stdin": "keyboard",
   "stdout": "all.txt",
   "stderr": "all.txt",
   "note": "Bash shorthand for > all.txt 2>&1."
  },
  {
   "op": "cmd | next",
   "label": "|",
   "stdin": "keyboard",
   "stdout": "next (stdin)",
   "stderr": "terminal",
   "note": "Only stdout flows down the pipe. Errors bypass it and print to the screen."
  },
  {
   "op": "cmd 2>&1 | next",
   "label": "2>&1 |",
   "stdin": "keyboard",
   "stdout": "next (stdin)",
   "stderr": "next (stdin)",
   "note": "Merge stderr into stdout, then pipe both."
  },
  {
   "op": "cmd 2> /dev/null",
   "label": "2> /dev/null",
   "stdin": "keyboard",
   "stdout": "terminal",
   "stderr": "/dev/null (discarded)",
   "note": "Throw errors away. Use sparingly."
  },
  {
   "op": "cmd | tee log.txt",
   "label": "| tee",
   "stdin": "keyboard",
   "stdout": "terminal + log.txt",
   "stderr": "terminal",
   "note": "tee duplicates stdout to the screen and a file."
  }
 ]
};
