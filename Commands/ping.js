module.exports.info = {
    name: 'ping',
    regex: /ping|пин[кг]/,
    desc: 'Pinging'
};

module.exports.run = (message) => {
    const embed = new Bot.Discord.RichEmbed()
    .setAuthor('Pong!', message.author.avatarURL)
    .setDescription(`**Discrod API - \`${Math.round(Bot.client.ping)} ms\`**`)
    .setFooter(`${Bot.name} ${Bot.version}`)
    .setColor(Bot.colors.blurple);
    message.channel.send(embed);
}
