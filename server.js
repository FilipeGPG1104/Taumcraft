require('dotenv').config()

const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())

const apiKey = process.env.API_KEY
const channelId = process.env.CHANNEL_ID

/* INSCRITOS */

app.get('/api/inscritos', async (req, res) => {

    try{

        const resposta = await fetch(

`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`

        )

        const dados = await resposta.json()

        const inscritos =
        dados.items[0].statistics.subscriberCount

        res.json({ inscritos })

    }

    catch(erro){

        res.status(500).json({
            erro:'Erro ao pegar inscritos'
        })
    }
})

/* VIDEOS */

app.get('/api/videos', async (req, res) => {

    try{

        /* PLAYLIST */

        const resCanal = await fetch(

`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`

        )

        const dadosCanal =
        await resCanal.json()

        const uploads =

        dadosCanal.items[0]
        .contentDetails
        .relatedPlaylists
        .uploads

        /* VIDEOS */

        const resVideos = await fetch(

`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploads}&maxResults=20&key=${apiKey}`

        )

        const dadosVideos =
        await resVideos.json()

        const videos = []

        for(const video of dadosVideos.items){

            const videoId =
            video.snippet.resourceId.videoId

            const detalhes = await fetch(

`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${apiKey}`

            )

            const dadosDetalhes =
            await detalhes.json()

            videos.push({

                videoId,

                title: video.snippet.title,

                thumbnail:
                video.snippet.thumbnails.high.url,

                publishedAt:
                video.snippet.publishedAt,

                duration:
                dadosDetalhes.items[0]
                .contentDetails.duration
            })
        }

        res.json(videos)

    }

    catch(erro){

        res.status(500).json({
            erro:'Erro ao pegar videos'
        })
    }
})

app.listen(3000, () => {

    console.log('Servidor rodando na porta 3000')
})