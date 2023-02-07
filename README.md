# vippeterhou.github.io


## how to start

### Set up env
  - Install Homebrew for mac
  - brew install npm
  - npm install -g hexo-cli (hexo will be available directly. Instead, env path needs to be set if you use npm install hexo)
  - ...
 
### Local development
  - Clone this repo
  - Switch to dev branch
  - hexo g
  - hexo server (start local host)
  - Make your changes
  - git add/commit/push
  
### Deploy
  - In dev branch
  - hexo clean (May not be necessary)
  - hexo g (May not be necessary)
  - hexo deploy
  - It will push changes accordingly to main branch
  - Wait for a while. Then you will see the changes work.
