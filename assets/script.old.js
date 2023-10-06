// Hành động - methods / Giá trị - thuộc tính / Event - sự kiện 
// Hàm updateInnerHTML có Promise
const updateInnerHTML = (element, newHTML) => {
    return new Promise((resolve) => {
        element.innerHTML = newHTML;
        resolve();
    });
};

let songitems = []; // Thay đổi thành let để gán lại giá trị

document.addEventListener('DOMContentLoaded', () => {
    // Định nghĩa các biến global
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);

    const PLAYER_STORAGE_KEY = "MUSIC_KEY"

    const tabs = $$('.tab-item');
    const panes = $$('.tab-pane');
    const tabActive = $('.tab-item.active');
    const playList = $('.tab-pane.active');
    const line = $('.tabs .line'); // Đã thêm dòng này để lấy phần tử line
    const name = $('header h2');
    const singer = $('header h3');
    const cdThumb = $('.cd_thumb');
    const audio = $('audio');
    const playBtn = $('.btn-toggle-play'); // Lấy đúng phần tử nút play
    const iconHeart = $('.box-2');
    const iconVolume = $('.volume-control')
    const timeline = $('.timeline');
    const timelineBar = $('.timeline-bar');
    const prevBtn = $('.btn_prev');
    const nextTrack = $('.btn_next');
    const randBtn = $('.btn_random');
    const repeatBtn = $('.btn_repeat')
    const currentTime = $('.currentTime');
    const totalTime = $('.totalTime');

    requestIdleCallback(() => {
        line.style.left = tabActive.offsetLeft + "px";
        line.style.width = tabActive.offsetWidth + "px";
    });

    const app = {
        currentIndex: 0,
        isPlaying: false,
        isPlayRandom: false,
        isPlayRepeat: false,
        config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
        setConfig: function (key, value) {
            this.config[key] = value;
            localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
        },

        songs: [
            {
                name: 'Chúng ta của hiện tại',
                singer: 'Nguyễn Thanh Tùng',
                path: './assets/audio/CTCHT.m4a',
                images: './assets/img/song1.webp'
            },
            {
                name: 'M.',
                singer: '16 Typh',
                path: './assets/audio/m16typh.mp3',
                images: './assets/img/song2.jpg'
            },
            {
                name: 'Trước khi em tồn tại',
                singer: 'Remix',
                path: './assets/audio/TruocKhiEmTonTai.mp3',
                images: './assets/img/song3.jpg'
            },
            {
                name: 'Già cùng nhau là được',
                singer: 'TNS4LIFE',
                path: './assets/audio/GiaCungNhauLaDuoc.mp3',
                images: './assets/img/song5.jpg'
            },
            {
                name: 'Cảm ơn',
                singer: '16 Typh',
                path: './assets/audio/camon.mp3',
                images: './assets/img/song2.jpg'
            },
            {
                name: 'Thôi trễ rồi chắc anh phải về đây',
                singer: 'Tùng TeA - Taynguyensound',
                path: './assets/audio/ThoiTreRoiChacAnhPhaiVeDay.mp3',
                images: './assets/img/song7.jpg'
            },
            {
                name: 'Chưa phai mờ',
                singer: 'Lil Shady',
                path: './assets/audio/ChuaPhaiMo.mp3',
                images: './assets/img/song4.jpg'
            },
            {
                name: 'WEDDING MOMENT - ANH ĐÁNH RƠI NGƯỜI YÊU NÀY',
                singer: 'Phương Thanh - Quốc Đạt',
                path: './assets/audio/AnhDanhRoiNguoiYeuNay.mp3',
                images: './assets/img/song8.jpg'
            },
            {
                name: 'Miên man',
                singer: 'Minh Huy',
                path: './assets/audio/MienMan.mp3',
                images: './assets/img/song9.jpg'
            },
            {
                name: 'Forrest Gump',
                singer: 'Robber Hustlang',
                path: './assets/audio/forrestgump.mp3',
                images: './assets/img/song10.jpg'
            },
            {
                name: 'Em chưa bao giờ dấu anh điều gì',
                singer: 'D.Blue - Đạt G',
                path: './assets/audio/ECBGDADG.mp3',
                images: './assets/img/song11.jpg'
            }
        ],

        render: function() {
            const htmls = this.songs.map((song, index) => {
                return `
                    <div class="songs-item" data-index="${index}">
                        <div class="songs-thumb" style="background-image: url(${song.images});"></div>
                        <div class="songs-body">
                            <h3 class="name-track">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                        </div>
                        <div class="options">
                            <i class="fa-solid fa-ellipsis"></i>
                        </div>
                    </div>
                `;
            }).join('');
            return htmls; // Trả về nội dung HTML
        },

        callAPI: function() {
            fetch('./api.json')
                .then(res => res.json())
                .then(data => {
                    this.renderLyric(data);  // Gọi hàm renderLyric và truyền dữ liệu vào để xử lý nó là callback:)
                    this.renderVersion(data)
                })
                .catch(error => {
                    console.log("Error calling API:", error);
                });
        },
        
        renderLyric: function(data) {
            const lyricContainer = document.querySelector('#tab-2.tab-pane');
            if (data.lyric[this.currentIndex]) {
                const lyricText = data.lyric[this.currentIndex].content;
                lyricContainer.innerHTML = `<h2> ${this.currentSong.name}</h2> <div class="lyric">${lyricText}</div>`
            }
            if (data.lyric[this.currentIndex].content === 'null') {
                lyricContainer.innerHTML = `<h2> ${this.currentSong.name}</h2> <div class="lyric" style="text-align: center; margin-top: 20px;">Chưa cập nhật lyric, chờ nhé ...!</div>`;
            }
        },
        
        renderVersion : function() {
            const projectDetails = document.getElementById('tab-3');
            return fetch('./api.json')
                .then(res => res.json())
                .then(data => {
                    const projectInfo = document.createElement('div');
                    projectInfo.innerHTML = `<div id="project-details">
                        <h1>Thông tin dự án</h1>
                        <p><strong>Version:</strong> ${data.version.version}</p>
                        <p><strong>Date:</strong> ${data.version.date}</p>
                        <p><strong>Time:</strong> ${data.version.time}</p>
                        <p><strong>Description:</strong> ${data.version.description}</p>
                        <p><strong>Features:</strong></p>
                        <ul>
                            ${data.version.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                        <p><strong>Copyright:</strong> ${data.version.copyright}</p>
                        <p><strong>GitHub Source:</strong> <a href="${data.version.github_source}">${data.version.github_source}</a></p></div>
                    `;
                    projectDetails.innerHTML = '';
                    projectDetails.appendChild(projectInfo); //Thêm class vao trong thẻ cha
                })
                .catch(error => {
                    console.error('Lỗi gì ấy ta?:', error);
                });
        },
        

        handleEvents: function() {
            // Animate CD
            const cdThumbAnimate = cdThumb.animate([
                { transform: 'rotate(360deg)' }
            ], {
                duration: 10000, // time 10 seconds
                iterations: Infinity
            });
            cdThumbAnimate.pause()

            // Phóng to thu nhỏ đĩa CD
            const cd = document.querySelector('.cd');
            const cdWith = cd.offsetWidth;
            document.onscroll = () => {
                const scrollTop = window.screenY || document.documentElement.scrollTop;
                const newCD = cdWith - scrollTop;
                cd.style.width = newCD > 0 ? newCD +'px' : 0;
                cd.style.opacity = newCD/cdWith;
            }
            
            // Xử lý play/pause bài hát khi click vào nút play/pause
            playBtn.addEventListener('click', function() {
                if (!app.isPlaying) {
                    audio.play();
                } else {
                    audio.pause();
                }
            });

            iconHeart.onclick = () => {
                if(iconHeart.classList.contains('ok-check')) {
                    iconHeart.classList.remove('ok-check');
                } else {
                    iconHeart.classList.add('ok-check')
                }
            }
            
            iconVolume.onclick = () => {
                if(iconVolume.classList.contains('ok-check')) {
                    audio.volume = 1;
                    iconVolume.classList.remove('ok-check')
                } else {
                    audio.volume = 0;
                    iconVolume.classList.add('ok-check')
                }
            }

            // Không dùng addEventListener thì thêm 'on' trước events
            audio.onplay = () => {
                app.isPlaying = true;
                playBtn.classList.add('playing');
                cdThumbAnimate.play()
                this.callAPI();
            };
            audio.onpause = () => {
                app.isPlaying = false;
                playBtn.classList.remove('playing');
                cdThumbAnimate.pause();
            };
            
            // Bật bài hát trước
            prevBtn.addEventListener('click', function() {
                if (app.isPlayRandom) {
                    app.randomSong()
                } else {
                    app.prevSong();
                }
                audio.play();
                app.render();
            });

            // Bật bài hát tiếp theo
            nextTrack.addEventListener('click', function() {
                if (app.isPlayRandom) {
                    app.randomSong()
                } else {
                    app.nextSong();
                }
                audio.play();
                app.render();
            });
            
            // replay lại bài hát hiện tại
            repeatBtn.addEventListener('click', () => {
                app.isPlayRepeat = !app.isPlayRepeat
                repeatBtn.classList.toggle('active', app.isPlayRepeat)
                app.setConfig('isRepeat', app.isPlayRepeat)
            });

            // Xử lý bật/tắt random Songs
            randBtn.addEventListener('click', () => {
                app.isPlayRandom = !app.isPlayRandom; // Đảo ngược giá trị, hoán đổi true/false mỗi khi onclick
                randBtn.classList.toggle('active', app.isPlayRandom);
                app.setConfig('isRandom', app.isPlayRandom)
            });
            
            // Tự chuyển bài khi ended
            audio.onended = () => {
                if (this.isPlayRepeat) {
                    audio.play();
                } else {
                   nextTrack.click()
                }
            };


            playList.addEventListener('click', function(e) {
                const getSong = e.target.closest('.songs-item:not(.active)');
                const getOptions = e.target.closest('.options');
                if (getSong || getOptions) {
                        app.currentIndex = parseInt(getSong.dataset.index); //Convert String sang Number
                        app.loadCurrentSong();
                        audio.play();
                }
            });
            
            // Xử lý khi click vào timeline (thanh thời gian)
            timeline.onclick = (e) => {
                const timelineRect = timeline.getBoundingClientRect(); // Lấy kích thước và vị trí của timeline
                const clickX = e.clientX - timelineRect.left; // Tính toán vị trí mà người dùng đã click trên timeline (theo chiều ngang)
                const timelineWidth = timelineRect.width; // Lấy chiều rộng của timeline
                const seekTime = (clickX / timelineWidth) * audio.duration; // Tính toán thời gian mà người dùng muốn tua đến (theo phần trăm chiều ngang)
                audio.currentTime = seekTime; // Đặt thời gian hiện tại của bài hát đến thời điểm muốn tua đến
            };

            // Xử lý sự kiện thời gian bài hát thay đổi (sự kiện ontimeupdate của audio)
            audio.ontimeupdate = () => {
                const Time = app.formatTime(audio.currentTime)
                currentTime.textContent = Time;
                const percentWidth = (audio.currentTime / audio.duration) * 100; // Tính toán phần trăm thời gian đã trôi qua
                timelineBar.style.width = `${percentWidth}%`; // Thiết lập chiều rộng của thanh thời gian (progress-timeline) dựa trên phần trăm đã trôi qua
            
            };    
        },

        loadCurrentSong: function() {
            // Update UI player
            name.innerText = `Song: ${this.currentSong.name}`;
            singer.innerText = `Artist: ${this.currentSong.singer}`;
            cdThumb.style.backgroundImage = `url(${this.currentSong.images})`;
            audio.src = this.currentSong.path;
            // Hiển thị realtime thời gian của bài hát 
            audio.addEventListener('loadedmetadata', () => {
                const timeSong = this.formatTime(audio.duration);
                totalTime.textContent = timeSong
            });
            this.updateList();
        },
        
        formatTime: function(second) {
            let hours = Math.floor(second / 3600);
            let minutes = Math.floor((second - hours * 3600) / 60);
            let seconds = Math.floor(second - hours * 3600 - minutes * 60);
            hours = hours < 10 ? (hours > 0 ? '0' + hours : '00') : hours;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;
            return (hours !== '00' ? hours + ':' : '') + minutes + ':' + seconds;
        },
        

        // Cập nhật UI Playlist
        updateList: function() {
            // Lấy danh sách bài hát trong tab hiện tại
            const songItems = Array.from($$('.songs-item'));
            // Đánh dấu bài hát hiện tại
            songItems.forEach((item, index) => {
                const optionsDiv = item.querySelector('.options');
                const iElement = optionsDiv.querySelector('i');
        
                if (index === this.currentIndex) {
                        iElement.classList.replace('fa-ellipsis', 'play-img')
                        item.classList.add('active')
                } else {
                        iElement.classList.replace('play-img','fa-ellipsis')
                        item.classList.remove('active')
                }
            });
            this.scrollToActiveSong()
        },
        
        scrollToActiveSong: function() {
            setTimeout(() => {
                $('.songs-item.active').scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                })
            }, 500)
        },

        prevSong: function() {
            this.currentIndex--;
            if (this.currentIndex < 0) {
                this.currentIndex = this.songs.length-1;
            }
            this.loadCurrentSong();
        },

        nextSong: function() {
            this.currentIndex++;
            if (this.currentIndex >= this.songs.length) {
                this.currentIndex = 0;
            }
            this.loadCurrentSong();
        },    
        
        randomSong: function() {
            let newSong;
            do {
                newSong = Math.floor(Math.random() * app.songs.length);
            } while (newSong === app.currentIndex)
            app.currentIndex = newSong;
            app.loadCurrentSong()
        },

        defineProperties: function() {
            Object.defineProperty(this, 'currentSong', {
                get: function() {
                    return this.songs[this.currentIndex];
                }
            });
        },
        
        
        // Không sử dụng Arrow Function vì không có ngữ cảnh this
        start: function() {
            this.defineProperties(); // Định nghĩa các thuộc tính cho object
            this.handleEvents(); // Lắng nghe / xử lý các sự kiện (DOM Events)
            this.loadCurrentSong(); // Hiển thị thông tin bài hát vào UI
            return this.render(); // Return the result of render(), sau return code không thực thi
        }
    }
    
    const tabContents = [
        {
            tabId: 'tab-1',
            content: app.render()
        },
        {
            tabId: 'tab-2',
            content: '<h2>Test</h2>'
        },
        {
            tabId: 'tab-3',
            content: app.renderVersion()
        },
        {
            tabId: 'tab-4',
            content: '<h2>Bùi Thanh Quân</h2> <p>Liên hệ qua các link mạng xã hội ở bên dưới, xin cảm ơn !</p>ip'
        }
    ];

    // Hiện thị danh sách playlist có sẵn
    updateInnerHTML(panes[0], app.render());
    const listSong = $$('.songs-item');

    const applyLightMode = () => {
        playlist.classList.add('playlist-light-mode');
        $('.container').style.backgroundImage = "url('./assets/img/light.png')";
        line.classList.add('line-light-mode');
        $('.heading-logo').classList.add('light');
        songitems.forEach(item => {
            item.classList.add('songs-item-light-mode');
        });
        listSong.forEach(item => {
            item.classList.add('songs-item-light-mode');
        });
    };

    const removeLightMode = () => {
        playlist.classList.remove('playlist-light-mode');
        $('.container').style.backgroundImage = "url('./assets/img/night.jpg')";
        line.classList.remove('line-light-mode');
        $('.heading-logo').classList.remove('light');
        songitems.forEach(item => {
            item.classList.remove('songs-item-light-mode');
        });
        listSong.forEach(item => {
            item.classList.remove('songs-item-light-mode');
        });
    };

    // Xử lý khi đã get ra các tabs
    tabs.forEach((item, index) => {
        // Lấy ra thông tin của tabs tương ứng với id đã get
        const pane = panes[index];
        // Xử lý nội sự kiện khi click
        item.addEventListener('click', () => {
            // Lấy nội dung content của tab đang nhấp
            const getContentTabSelect = tabContents.find(content => content.tabId === pane.id);
            // Update nội dung từ obj vào html
            updateInnerHTML(pane, getContentTabSelect.content)
                .then(() => {
                    if(index === 0) {
                        songitems = $$('.songs-item');
                    }
                    app.render();
                    // Kiểm tra xem có active chưa
                    $('.tab-item.active').classList.remove('active');
                    line.style.left = item.offsetLeft + "px";
                    line.style.width = item.offsetWidth + "px";
                    // Thêm lớp 'active' vào tab được chọn
                    item.classList.add('active');
                    // Ẩn nội dung các tabs khác
                    panes.forEach((pane) => {
                        pane.style.display = 'none';
                    });
                    // Hiện nội dung tabs đã chọn
                    pane.style.display = 'block';
                    // Lưu trạng thái phát của bài hát
                    app.updateList();
                    app.callAPI();

                    // Check if light mode is active and apply styles accordingly
                    if (playlist.classList.contains('playlist-light-mode')) {
                        applyLightMode();
                    } else {
                        removeLightMode();
                    }
                })
                .catch(error => {
                    console.error('Error updating innerHTML:', error);
                });
        });
    });

    // Xử lý bật tắt Dark/Light Mode
    const playlist = $('.play-list');
    const switchInput = document.getElementById('switch');
    const rowToggleIcon = $('.row-toggle i');
    
    switchInput.addEventListener('change', function () {
        // Kiểm tra trạng thái của toggle switch
        if (this.checked) {
            playlist.classList.add('playlist-light-mode');
            applyLightMode();
            // Thay đổi icon thành mặt trời khi bật
            rowToggleIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            playlist.classList.remove('playlist-light-mode');
            removeLightMode();
            // Thay đổi icon thành mặt trăng khi tắt
            rowToggleIcon.classList.replace('fa-sun', 'fa-moon');
        }
    });
    
    app.start();

});