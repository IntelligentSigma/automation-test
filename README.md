# Automation Test

The Automation Test is the test file for the automation framework

---

## Setup



## Run It (Locally)



## NOTE:



## Run Unit Tests



## Run Acceptance Tests



#####
# Install Selenium
#####



#####
# Run Selenium Server Standalone
#####

# if you've installed "webdriver-manager"
webdriver-manager start
# and if webdriver out of date: webdriver-manager update --standalone


# OTHERWISE, if you install selenium server standalone:
selenium-server -p 4444

#####
# Run the app locally
#####

# If you've never run it before:
npm install                                         # to install all modules
./node_modules/coffee-script/bin/cake env:setup     # to setup the config
