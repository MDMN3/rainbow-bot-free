const Discord = require('discord.js');
const fs = require('fs');
const forEachTimeout = require('foreach-timeout');

/** @namespace process.env.BOT_TOKEN */

class Bot {
    constructor() {
        let _this = this;

        this.Discord = Discord;
        this.fs = fs;
        this.forEachTimeout = forEachTimeout;

        this.client = new Discord.Client({disableEveryone: true});
        this.client.login(process.env.BOT_TOKEN).then(() => delete process.env.BOT_TOKEN);

        this.name = 'Colorful FREE';
        this.version = '1.0.0';

        this.creatorID = '242975403512168449';

        this.commands = [];

        this.colors = {
            blurple: '7289da',
            red: 'ff5555',
            green: '55ff55',
        };

        this.serverLink = 'https://discord.gg/NvcAKdt';

        this.err = (message, reason, perms) => {
            const embed = new Discord.RichEmbed()
            .setAuthor('Error', message.channel.avatarURL)
            .setColor(_this.colors.red)
            .setDescription(`Reason: ${reason}`);
            if (perms) embed.setDescription(`Missing permissions: \`${perms}\``);
            message.channel.send(embed);
        };

        this.toMoscowTime = (time) => time.toLocaleString('ru-RU', {timeZone: 'Europe/Moscow', hour12: false}).replace(/\/|\./g, '-');
        this.addCommas = (int) => int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        this.stop = new Set();
        this.rainbowColors = ['#ff0000', '#ffa500', '#ffff00', '#00ff00', '#00BFFF', '#0000ff', '#ff00ff'];
        _this.rainbow = async () => {
            forEachTimeout(_this.rainbowColors, color => {
                _this.client.guilds.forEach(guild => {
                    const role = guild.roles.find(r => r.name.match(/multicolor/i));
                    if (!role || !role.editable) _this.stop.add(guild.id);
                    if (!_this.stop.has(guild.id)) role.setColor(color);
                });
            }, 3e3).then(() => _this.rainbow());
        };

        _this.client.on('ready', () => {
            _this.rainbow();

            setInterval(() => {
                _this.client.guilds.forEach(g => _this.stop.add(g.id));
            }, 72e5);
            _this.prefixes = ['=', `<@${_this.client.user.id}>`];
            _this.footer = `Please, buy full version 1$ (${_this.prefixes[0]}donate)`
            _this.client.user.setActivity(`${_this.prefixes[0]}help`, {type: 0});
            console.log(`${this.client.user.tag} is Logged successfully.\nGuilds: ${this.client.guilds.size}\nUsers: ${this.client.users.size}\nChannels: ${this.client.channels.size}`);
            fs.readdir('./Commands', (err, cmds) => {
                if (err) throw err;
                cmds.forEach(command => {
                    const cmd = require(`./Commands/${command}`);
                    _this.commands.push({
                        name: cmd.info.name,
                        regex: cmd.info.regex.toString().slice(1, -1),
                        args: cmd.info.args,
                        desc: cmd.info.desc,
                        run: cmd.run,
                        private: cmd.info.private,
                        hidden: cmd.info.hidden
                    });
                })
            })
        })


        _this.client.on('message', message => {
            const prefix = _this.prefixes.find(p => message.content.startsWith(p));
            if (!message.guild || message.author.bot) return;
            //something
            if (!prefix) return;

            const args = message.content.slice(prefix.length).trim().split(/ +/g);
            const command = args.shift().toLowerCase();

            const cmd = _this.commands.find(c => command.match(new RegExp(c.regex)));
            if (cmd && (!cmd.private || message.author.id === _this.creatorID)) cmd.run(message, args, command);

            if (command === 'help') {
                const helpCommands = _this.commands.filter(c => !c.private && !c.hidden)
                const arr = helpCommands.map(cmd => `◽ **${cmd.name} ${cmd.args?`\`${cmd.args}\``:''} -** ${cmd.desc}`);
                const embed = new Discord.RichEmbed()
                .setAuthor('Help', message.author.avatarURL)
                .setDescription(`**Commands list:**\n${arr.join('\n')}`)
                .addField('Buy full version', `**:kiwi: Qiwi - https://qiwi.me/andreybots\n:moneybag: PayPal - https://donatebot.io/checkout/496233900071321600\n◽ Type ${_this.prefixes[0]}donate for more info**`)
                .setColor(_this.colors.blurple)
                .setFooter('<> with ❤ by ANDREY#2623');
                message.channel.send(embed);
            }
        });

        this.sendIn = (id, msg) => _this.client.channels.get(id).send(msg);

        _this.client.on('guildCreate', guild => {
            guild.createRole({name: 'Multicolor'});
            const embed = new Discord.RichEmbed()
            .addField(':inbox_tray: New server information', `
            Name: \`${guild.name}\`
            ID: \`${guild.id}\`
            Objects count: \`m: ${guild.memberCount}, r: ${guild.roles.size}, ch: ${guild.channels.size}, e: ${guild.emojis.size}\`
            Owner: ${guild.owner.user} \`${guild.owner.user.tag}\`
            Created at: \`${_this.toMoscowTime(guild.createdAt)}\``)
            .setColor(_this.colors.green)
            .setThumbnail(guild.iconURL)
            .setFooter(`Now we have ${_this.client.guilds.size} servers`)
            _this.sendIn('552092083217891328', embed);

            let channels = guild.channels.filter(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'));
            if (channels.size > 0) channels.first().send(`You added free version of bot "Colorful", so, please, buy full version for just 1$ (${_this.prefixes[0]}donate). Best server ever: https://discord.gg/NvcAKdt`);
        });

        _this.client.on('guildDelete', guild => {
            const embed = new Discord.RichEmbed()
            .addField(':inbox_tray: New server information', `
            Name: \`${guild.name}\`
            ID: \`${guild.id}\`
            Objects count: \`m: ${guild.memberCount}, r: ${guild.roles.size}, ch: ${guild.channels.size}, e: ${guild.emojis.size}\`
            Owner: ${guild.owner.user} \`${guild.owner.user.tag}\`
            Created at: \`${_this.toMoscowTime(guild.createdAt)}\``)
            .setColor(_this.colors.red)
            .setThumbnail(guild.iconURL)
            .setFooter(`Now we have ${_this.client.guilds.size} servers`)
            _this.sendIn('552092083217891328', embed);
        })

    };
};

global.Bot = new Bot();
