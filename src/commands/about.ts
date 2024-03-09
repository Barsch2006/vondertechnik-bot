import { Colors, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js'

export default {
  data: new SlashCommandBuilder().setName('about').setDescription('About me'),
  async execute(interaction: CommandInteraction) {
    if (!interaction.isRepliable()) {
      console.log('Gegebene interaction kann nicht beantwortet werden.')
      return
    }

    let version = '1.0.0';

    const aboutEmbed = new EmbedBuilder()
      .setColor(Colors.White)
      .setTitle('Etwas über mich')
      .setAuthor({ name: 'BotvonderTechnik' })
      .setDescription(
        'Ich bin ein Discord-Bot, der für das Bereitstellen nützlicher Tools und Funktionen entwickelt wurde.' +
          'Um zu sehen, was ich alles kann, nutze einfach /help.\n\n**__Meine Entwickler:__**'
      )
      .addFields(
        { name: 'heeecker', value: '<@768872955500953710>', inline: true },
        { name: 'christian', value: '<@779419763938951228>', inline: true },
        { name: 'Version:', value: version },
        { name: 'Github Repo:', value: 'https://github.com/Barsch2006/vondertechnik-bot' }
      )
      .setTimestamp()
      .setFooter({ text: '\u200B', iconURL: interaction.client.user?.avatarURL() ?? undefined })

    try {
      await interaction.reply({
        embeds: [aboutEmbed],
        ephemeral: true
      })
    } catch (err) {
      console.error(`About-Info konnte nicht gesendet werden. ${JSON.stringify(err)}`)
    }
  }
}