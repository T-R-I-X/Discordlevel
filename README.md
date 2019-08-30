<div align="center">
  <br />
  <br />
  <p>
    <a href="https://discord.gg/Hc9rC8X"><img src="https://discordapp.com/api/guilds/379277541229330432/widget.png" alt="Discord server" /></a>
    <a href="https://www.npmjs.com/package/discord-leveling"><img src="https://img.shields.io/npm/v/discord-leveling.svg" alt="NPM version" /></a>
    <a href="https://www.npmjs.com/package/discord-leveling"><img src="https://img.shields.io/npm/dt/discord-leveling.svg" alt="NPM downloads" /></a>
  </p>
  <p>
    <a href="https://nodei.co/npm/discord-leveling/"><img src="https://nodei.co/npm/discord-leveling.png?downloads=true&stars=true" alt="NPM info" /></a>
  </p>
</div>

## Installation

```js
$ npm install --save discord-leveling
```

Checkout my package for economy systems on discord bots!
[discord-economy](https://www.npmjs.com/package/discord-economy)

### Required packages

-   [sequelize](https://www.npmjs.com/package/sequelize) the DB wrapper of sqlite3 of this project (`npm install --save sequelize`)
-   [sqlite3](https://www.npmjs.com/package/sqlite3) Core DB (`npm install --save sqlite3`)

### Optional

-   [discord.js](https://www.npmjs.com/package/discord.js) - (`npm install --save discord.js`)
-   [discord.js-commando](https://www.npmjs.com/package/discord.js-commando) - (`npm install --save discord.js-commando`)
-   [eris](https://www.npmjs.com/package/eris) - (`npm install --save eris`)

## ChangeLog
- [1.0.0](https://www.npmjs.com/package/discord-leveling/v/1.0.0) Package got made!!
- [1.0.1](https://www.npmjs.com/package/discord-leveling/v/1.0.1) Npm page got updated including a bot example, [setxp, setlevel, leaderboard] got little changes. Delete function added.
- [1.0.2](https://www.npmjs.com/package/discord-leveling/v/1.0.2) The Leaderboard function now has a filter function, some example bot typos got fixed. And the Leaderboard overall works again normally!!
- [1.0.3](https://www.npmjs.com/package/discord-leveling/v/1.0.3) The Leaderboard now sorts the results better. Also SetXp and SetLevel can now be set to 0!

**SetXp**

```js
/**
 * @param {string} [UserID] - Somebody's discord user ID.
 * @param {integer} [toSet] - How much xp you want the user to have.
 */

var dl = require('discord-leveling')
dl.SetXp(UserID, toSet)

/**
Expected Promise Output
{userid, xp}
 */
```

**SetLevel**

```js
/**
* @param {string} [UserID] - Somebody's discord user ID.
* @param {integer} [toSet] - How much levels you want the user to have.
 */

var dl = require('discord-leveling')
dl.SetLevel(UserID, toSet)

/**
Expected Promise Output
{userid, level}
 */
```

**AddXp**

```js
/**
* @param {string} [UserID] - Somebody's discord user ID.
* @param {integer} [toAdd] - How much xp you want to add.
 */

var dl = require('discord-leveling')
dl.AddXp(UserID, toAdd)

/**
Expected Promise Output
{userid, oldxp, newxp}
 */
```

**AddLevel**

```js
/**
* @param {string} [UserID] - Somebody's discord user ID.
* @param {integer} [toAdd] - How much levels you want to add.
 */

var dl = require('discord-leveling')
dl.AddLevel(UserID, toAdd)

/**
Expected Promise Output
{userid, oldlevel, newlevel}
 */
```

**Leaderboard**

```js
/**
 * @param {Object} data - The data you want to attach to the function.
  All keys in this object are optional.
 * @param {integer} data.limit - Limit how much users to fetch.
 * @param {string} data.search - Search the placement of a user in leaderboard.
 */

var dl = require('discord-leveling')
dl.Leaderboard({limit: NUMBER, search: 'UserID'})

/**
Expected Promise Output without data.search
[ {userid, level, xp}, {userid, level, xp}, {userid, level, xp} ]
array[0] is the first place of the leaderboard. array[1] second etc.
 */

 /**
Expected Promise Output with data.search
{userid, placement}
 */
```

**Fetch**

```js
/**
 * @param {string} [UserID] - Somebody's discord user ID.
 */

var dl = require('discord-leveling')
dl.Fetch(UserID)

/**
Expected Promise Output
{userid, xp, level}
 */
```

**Delete**

```js
/**
 * @param {string} [UserID] - Somebody's discord user ID.
 */
var dl = require('discord-leveling')
dl.Delete(UserID)

/**
Expected Promise Output
{deleted}
 */
```

## Example Bot (discord.js)

```js
/*
If you want to make discord-leveling guild based you have to use message.author.id + message.guild.id as ID for example:
dl.AddLevel(message.author.id + message.guild.id, toAdd).then(l => console.log(l))

This will create an unique ID for each guild member
*/


//Requiring Packages
const discord = require('discord.js'); //This can also be discord.js-commando or other node based packages!
const dl = require('discord-leveling');

//Create the bot client
const client = new Discord.Client();

//Whenever someone types a message this gets activated.
//(If you use 'await' in your functions make sure you put async here)
client.on('message', async message => {

  //Set the prefix of the bot.
  const settings = {
    prefix: '!',
  }

  //This reads the first part of your message behind your prefix to see which command you want to use.
  var command = message.content.toLowerCase().slice(settings.prefix.length).split(' ')[0];

  //These are the arguments behind the commands.
  var args = message.content.split(' ').slice(1);

  //If the user that types a message is a bot account return.
  if (message.author.bot) return;

  //When someone sends a message add xp
  var profile = await dl.Fetch(message.author.id)
  dl.AddXp(message.author.id, 10)
  //If user xp higher than 100 add level
  if (profile.xp + 10 > 100) {
    await dl.AddLevel(message.author.id, 1)
    await dl.SetXp(message.author.id, 0)
    message.reply(`You just leveled up!! You are now level: ${profile.level + 1}`)
  }

  //If the message does not start with your prefix return.
  if (!message.content.startsWith(settings.prefix)) return;

  if (command === 'profile') {

    var user = message.mentions.users.first() || message.author

    var output = await dl.Fetch(user.id)
    message.channel.send(`Hey ${user.tag}! You have ${output.level} level(s)! and ${output.xp} xp!`);
  }

  if (command === 'setxp') {

    var amount = args[0]
    var user = message.mentions.users.first() || message.author

    var output = await dl.SetXp(user.id, amount)
    message.channel.send(`Hey ${user.tag}! You now have ${amount} xp!`);
  }

  if (command === 'setlevel') {

    var amount = args[0]
    var user = message.mentions.users.first() || message.author

    var output = await dl.SetLevel(user.id, amount)
    message.channel.send(`Hey ${user.tag}! You now have ${amount} levels!`);
  }

  if (command === 'leaderboard') {

    //If you put a mention behind the command it searches for the mentioned user in database and tells the position.
    if (message.mentions.users.first()) {

      var output = await dl.Leaderboard({
        search: message.mentions.users.first().id
      })
      message.channel.send(`The user ${message.mentions.users.first().tag} is number ${output.placement} on my leaderboard!`);

      //Searches for the top 3 and outputs it to the user.
    } else {

      dl.Leaderboard({
        limit: 3
      }).then(async users => { //make sure it is async

        var firstplace = await client.fetchUser(users[0].userid) //Searches for the user object in discord for first place
        var secondplace = await client.fetchUser(users[1].userid) //Searches for the user object in discord for second place
        var thirdplace = await client.fetchUser(users[2].userid) //Searches for the user object in discord for third place

        message.channel.send(`My leaderboard:

1 - ${firstplace.tag} : ${users[0].level} : ${users[0].xp}
2 - ${secondplace.tag} : ${users[1].level} : ${users[1].xp}
3 - ${thirdplace.tag} : ${users[2].level} : ${users[2].xp}`)

      })

    }
  }

  if (command == 'delete') { //You want to make this command admin only!

    var user = message.mentions.users.first()
    if (!user) return message.reply('Pls, Specify a user I have to delete in my database!')

    if (!message.guild.me.hasPermission(`ADMINISTRATION`)) return message.reply('You need to be admin to execute this command!')

    var output = await dl.Delete(user.id)
    if (output.deleted == true) return message.reply('Succesfully deleted the user out of the database!')

    message.reply('Error: Could not find the user in database.')

  }

})

//Your secret token to log the bot in. (never show this to anyone!)
client.login('token')
```
