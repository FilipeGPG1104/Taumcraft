const channelId = "UCKX9wbmSIeh-xB68GtHUWMw";

/* CONTADOR */

async function pegarInscritos(){

    try{

        const resposta = await fetch(
            "http://localhost:3000/api/inscritos"
        );

        const dados = await resposta.json();

        document.getElementById("subs").innerHTML =

        Number(dados.inscritos).toLocaleString("pt-BR")
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

        const resposta = await fetch(
            "http://localhost:3000/api/videos"
        );

        const dadosVideos = await resposta.json();

        const container =
        document.getElementById("videosContainer");

        for (const video of dadosVideos) {

            const duracaoSegundos =
            converterDuracao(video.duration);

            /* REMOVE SHORTS */

            if(duracaoSegundos < 90){

                continue;
            }

            const titulo = video.title;

            const thumb = video.thumbnail;

            const videoId = video.videoId;

            const data =
            new Date(video.publishedAt);

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