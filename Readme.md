# Frontend - Starting point

## Current Progress:
1. Login/singup page
2. Dashboard progress

## Requirements:

Node.js to be installed

## Steps:
1. Install Homebrew
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. Install Node.js
```bash
brew install node
```

3. verify installation
```bash
node -v
npm -v
```


# Next step:

1. install dependecies
```bash
npm install
```

2. start the project on localhost (this will run on localhost:3000)
```bash
npm start
```


3. **Add the resolved file**:
    ```sh
    git add README.md
    ```

4. **Commit the merge**:
    ```sh
    git commit -m "Resolved merge conflict in README.md"
    ```

5. **Push the changes to the remote repository**:
    ```sh
    git push origin master
    ```

Here are the commands combined:

```sh
code README.md
# Resolve conflicts in the file and save it
git add README.md
git commit -m "Resolved merge conflict in README.md"
git push origin master
