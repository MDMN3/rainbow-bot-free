module.exports.info = {
    name: 'rainbow',
    regex: /rainbow|rb/,
    desc: 'Start the rainbow role',
};

module.exports.run = (message) => {
    if (!message.member.hasPermission('MANAGE_ROLES')) return Bot.err(message, null, 'Manage roles');
    if (!Bot.stop.has(message.guild.id)) return Bot.err(message, 'Rainbow is already started');

    const role = message.guild.roles.find(r => r.name.match(/multicolor/i));
    if (!role) return Bot.err(message, 'Your server doesn\'t have the role with name "Multicolor"');
    if (!role.editable) return Bot.err(message, `I don't have enough permissions to edit the role ${role}`);

    Bot.stop.delete(message.guild.id);
    const embed = new Bot.Discord.RichEmbed()
    .setAuthor('Succes', message.author.avatarURL)
    .setDescription('Rainbow started succesfully')
    .setColor(Bot.colors.blurple)
    .setFooter(Bot.footer);
    message.channel.send(embed);
};
