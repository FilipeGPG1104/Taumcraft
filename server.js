require('dotenv').config()

const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())

const apiKey = process.env.API_KEY
const channelId = process.env.CHANNEL_ID

/* TESTE */

app.get('/', (req, res) => {

    res.send('Servidor funcionando!')
})

/* INSCRITOS */

app.get('/api/inscritos', async (req, res) => {

    try{

        const resposta = await fetch(

`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`

        )

        const dados = await resposta.json()

        console.log(dados)

        if(!dados.items){

            return res.status(400).json({

                erro:'API inválida ou canal não encontrado',

                detalhes:dados
            })
        }

        const inscritos =
        dados.items[0].statistics.subscriberCount

        res.json({

            inscritos
        })
    }

    catch(erro){

        console.log('ERRO INSCRITOS:', erro)

        res.status(500).json({

            erro: erro.message
        })
    }
})

/* VIDEOS */

app.get('/api/videos', async (req, res) => {

    try{

        /* CANAL */

        const resCanal = await fetch(

`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`

        )

        const dadosCanal =
        await resCanal.json()

        console.log(dadosCanal)

        if(!dadosCanal.items){

            return res.status(400).json({

                erro:'Erro ao pegar canal',

                detalhes:dadosCanal
            })
        }

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

            /* DETALHES */

            const detalhes = await fetch(

`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${apiKey}`

            )

            const dadosDetalhes =
            await detalhes.json()

            videos.push({

                videoId,

                title:
                video.snippet.title,

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

        console.log('ERRO VIDEOS:', erro)

        res.status(500).json({

            erro: erro.message
        })
    }
})

/* PORTA */

app.listen(3000, () => {

    console.log('Servidor rodando em:')
    console.log('http://localhost:3000')
})