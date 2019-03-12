module.exports.info = {
    name: 'donate',
    regex: /donate?|донат/,
    desc: 'Information about donate',
};

module.exports.run = (message) => {
    const embed = new Bot.Discord.RichEmbed()
    .setAuthor('Donation', message.author.avatarURL)
    .setDescription(`**By donating, you will get a lot of stuff on official server (${Bot.serverLink}) and full version of the bot**`)
    .addField('Whats the full version of the bot?', `
    **◽ 24/7 Rainbow
    ◽ Faster color changing
    ◽ Better colors
    ◽ More stable work
    ◽ No ads**`)
    .addField('Price', '**```1$ Or 65 RUB```**')
    .addField('Payment methods', '**:kiwi: Qiwi https://qiwi.me/andreybots\n:moneybag: PayPal https://donatebot.io/checkout/496233900071321600**')
    .setFooter(`${Bot.name} ${Bot.version}`)
    .setColor(Bot.colors.blurple);
    message.channel.send(embed);
}
