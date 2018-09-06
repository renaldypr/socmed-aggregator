const request = require('request');
const axios = require('axios');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports = {
  showStarredRepo: function(req,res) {
    const options = {
      url: 'https://api.github.com/user/starred?sort=created',
      headers: {
        'User-Agent': 'request',
        Authorization: 'token ' + process.env.GITHUB_TOKEN
      }
    }
    request.get(options, (error, response, body) => {
      if (!error) {
        res.status(200).json({
          message: 'find all success!',
          data: JSON.parse(body)
        })
      } else {
        res.status(500).json(error)
      }
    })
  },
  searchByName: function(req,res) {
    const options = {
      url: 'https://api.github.com/user/starred?sort=created',
      headers: {
        'User-Agent': 'request',
        Authorization: 'token ' + process.env.GITHUB_TOKEN
      }
    }
    request.get(options, (error, response, body) => {
      if (!error) {
        let parsedBody = JSON.parse(body)
        let filter = req.body.name;

        for (var i = 0; i < parsedBody.length; i++) {
          if(filter === parsedBody[i].name) {
            break;
          }
        }
        if (i === parsedBody.length) {
          res.status(404).json({
            message: 'cannot find a starred repo with that name!'
          })
        } else {
          res.status(200).json({
            message: 'search success!',
            data: parsedBody[i]
          })
        }
      } else {
        res.status(500).json(error)
      }
    })
  },
  createRepo: function(req,res) {
    const options = {
      url: 'https://api.github.com/user/repos',
      headers: {
        'User-Agent': 'request',
        Authorization: 'token ' + process.env.GITHUB_TOKEN
      }
    }
    options.body = JSON.stringify({
      name: req.body.name,
      description: req.body.description
    })
    request.post(options, (error, response, body) => {
      if (!error) {
        if (req.body.name === null || req.body.name === undefined || req.body.name === '') {
          res.status(500).json({
            message: 'you must input a repo name!',
            error: JSON.parse(body).message
          })
        } else {
          res.status(200).json({
            message: 'new repo created successfully!',
            data: JSON.parse(body)
          })
        }
      } else {
        res.status(500).json(error)
      }
    })
  },
  searchByUsername: function(req,res) {
    const options = {
      url: 'https://api.github.com/users/' + req.params.username + '/repos?sort=created',
      headers: {
        'User-Agent': 'request',
        Authorization: 'token ' + process.env.GITHUB_TOKEN
      }
    }
    request.get(options, (error, response, body) => {
      if (!error) {
        if (JSON.parse(body).message) {
          res.status(404).json({
            message: 'username not found',
            error: JSON.parse(body).message
          })
        } else {
          res.status(200).json({
            message: 'search repo by id success!',
            data: JSON.parse(body)
          })
        }
      } else {
        res.status(500).json(error)
      }
    })
  },
  unstarRepo: function(req,res) {
    const options = {
      url: 'https://api.github.com/user/starred/' + req.params.username + '/' + req.params.repo,
      headers: {
        'User-Agent': 'request',
        Authorization: 'token ' + process.env.GITHUB_TOKEN
      }
    }
    request.delete(options, (error, response, body) => {
      if (!error) {
        if (body) {
          res.status(404).json({
            message: 'username/repo not found',
            error: JSON.parse(body).message
            })
        } else {
          res.status(200).json({
            message: 'repo unstarred successfully!'
          })
        }
      } else {
        res.status(500).json(error)
      }
    })
  },
  loginFB: function(req,res) {
    axios({
      method:'get',
      url:`https://graph.facebook.com/me?fields=id,name,email&access_token=${req.headers.token_fb}`,
    })
      .then(function(response) {
        User.find({email: response.data.email}, function(err, userData) {
          if (!err) {
            if(userData.length === 0) {
              let newUser = new User({
                username: response.data.name,
                email: response.data.email
              })
              newUser.save((err, user) => {
                if (!err) {
                  jwt.sign({name: user.username, email: user.email}, process.env.JWT_KEY, (err, token) => {
                    res.status(200).json({
                      token_jwt: token
                    })
                  })
                } else {
                  res.status(500).json(err)
                }
              })
            } else {
              jwt.sign({name: response.data.name, email: response.data.email}, process.env.JWT_KEY, (err, token) => {
                res.status(200).json({
                  token_jwt: token
                })
              })
            }
          } else {
            res.status(500).json(err);
          }
        })
      })
      .catch(err => {
        res.status(500).json(err)
      })
  },
}