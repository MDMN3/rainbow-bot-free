module.exports.info = {
    name: 'stop',
    regex: /stop|стоп/,
    desc: 'Stop the rainbow role',
};

module.exports.run = (message) => {
    if (!message.member.hasPermission('MANAGE_ROLES')) return Bot.err(message, null, 'Manage roles');
    if (Bot.stop.has(message.guild.id)) return Bot.err(message, 'Rainbow is already stopped');

    Bot.stop.add(message.guild.id);
    const embed = new Bot.Discord.RichEmbed()
    .setAuthor('Succes', message.author.avatarURL)
    .setDescription('Rainbow stopped succesfully')
    .setColor(Bot.colors.blurple)
    .setFooter(Bot.footer);
    message.channel.send(embed);
};
