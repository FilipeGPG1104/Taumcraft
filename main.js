const apiKey = "AIzaSyB-kX4RFkl0dfvmWFFHcZViK97Is1fv26Y";

const channelId = "UCKX9wbmSIeh-xB68GtHUWMw";

/* CONTADOR */

async function pegarInscritos(){

    try{

        const resposta = await fetch(

`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`

        );

        const dados = await resposta.json();

        const inscritos =
        dados.items[0].statistics.subscriberCount;

        document.getElementById("subs").innerHTML =

        Number(inscritos).toLocaleString("pt-BR")
        + " inscritos";

    }

    catch(erro){

        document.getElementById("subs")
        .innerHTML = "Erro ao carregar";

        console.log(erro);
    }
}

/* CONVERTER DURAÇÃO */

function converterDuracao(iso){

    const match = iso.match(

/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/

    );

    const horas =
    parseInt(match[1] || 0);

    const minutos =
    parseInt(match[2] || 0);

    const segundos =
    parseInt(match[3] || 0);

    return horas * 3600 + minutos * 60 + segundos;
}

/* VIDEOS */

async function carregarVideos(){

    try{

        /* PLAYLIST DE UPLOADS */

        const resCanal = await fetch(

`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`

        );

        const dadosCanal =
        await resCanal.json();

        const uploads =

        dadosCanal.items[0]
        .contentDetails
        .relatedPlaylists
        .uploads;

        /* PEGA VIDEOS */

        const resVideos = await fetch(

`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploads}&maxResults=20&key=${apiKey}`

        );

        const dadosVideos =
        await resVideos.json();

        const container =
        document.getElementById("videosContainer");

        for (const video of dadosVideos.items) {

            const videoId =
            video.snippet.resourceId.videoId;

            /* DETALHES DO VIDEO */

            const detalhes = await fetch(

`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${apiKey}`

            );

            const dadosDetalhes =
            await detalhes.json();

            const duracaoISO =

            dadosDetalhes.items[0]
            .contentDetails
            .duration;

            const duracaoSegundos =
            converterDuracao(duracaoISO);

            /* REMOVE SHORTS */

            if(duracaoSegundos < 90){

                continue;
            }

            const titulo =
            video.snippet.title;

            const thumb =
            video.snippet.thumbnails.high.url;

            const data =
            new Date(video.snippet.publishedAt);

            /* CARD */

            container.innerHTML += `

            <div class="swiper-slide">

                <a
                href="https://youtube.com/watch?v=${videoId}"
                target="_blank"
                class="video-card">

                    <img src="${thumb}">

                    <div class="info">

                        <h3>${titulo}</h3>

                        <p>
                        ${data.toLocaleDateString("pt-BR")}
                        </p>

                    </div>

                </a>

            </div>
            `;
        }

        /* SWIPER */

        new Swiper(".mySwiper", {

            slidesPerView:1.2,

            spaceBetween:15,

            loop:true,

            autoplay:{

                delay:3000,
            },

            breakpoints:{

                768:{

                    slidesPerView:2.2,
                },

                1024:{

                    slidesPerView:3,
                }
            }
        });
    }

    catch(erro){

        console.log(erro);
    }
}

/* INICIAR */

pegarInscritos();

carregarVideos();

/* TEMA */

const temaBtn =
document.getElementById("temaBtn");

temaBtn.addEventListener("click", () => {

    document.body.classList.toggle("light-mode");

    if(
        document.body.classList.contains("light-mode")
    ){

        temaBtn.innerHTML = "🌙";
    }

    else{

        temaBtn.innerHTML = "☀️";
    }
});