const app = Vue.createApp({
    data() {
        return {
            name: "Tags Input",
            tags_name: [],
            bar: null,
        }
    },
    methods: {
        load_progress() {
            this.bar = new ProgressBar.Circle('#cont', {
                color: '#aaa',
                strokeWidth: 4,
                trailWidth: 2,
                easing: 'easeInOut',
                duration: 200,
                text: {
                    autoStyleContainer: false
                },
                from: {
                    color: '#FFEA82',
                    a: 0
                },
                to: {
                    color: '#ED6A5A',
                    a: 1
                },
                step: function (state, circle) {
                    circle.path.setAttribute('stroke', state.color);
                    var value = Math.round(circle.value() * 30);
                    if (value === 0) {
                        circle.setText('');
                    } else {
                        circle.setText(value);
                    }
    
                }
            });
            this.bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
            this.bar.text.style.fontSize = '2rem';
        },

        convert() {
            const tags = document.getElementById('tags').value;
            let output = "";
            const english = /^[A-Za-z0-9]*$/;
            tags.split('\n').forEach(function (item) {
                if (item.length > 0) {
                    if (english.test(item[0])) {
                        output += '#' + item.trim().replace(/ /g, '') + ' ';
                    } else {
                        output += '#' + item.trim().replace(/ /g, '_') + ' ';
                    }
                }
            });
            this.tagcount();
            outarea = document.getElementById('output');
            outarea.value = output;
            outarea.scrollTo(0, outarea.scrollHeight);
        },

        select() {
            const dots = document.getElementById('dotcheck').checked;
            const tags = document.getElementById('output');
            if (dots == true) {
                output = ".\n";
                output = output.repeat(5);
                tags.value = output + tags.value;
            } else {
                this.convert();
                tags.value = tags.value;
            }

            tags.scrollTo(0, tags.scrollHeight);
            // console.log(tags);
            tags.select();
            document.execCommand('copy');
        },

        tagcount() {
            const tags = document.getElementById('tags').value;
            const out = document.getElementById('outcount');
            const counts = tags.split('\n').length;
            this.bar.animate(counts / 30);
        },

        cleartext() {
            document.getElementById('tags').value = ''
            document.getElementById('output').value = ''
            this.bar.animate(0)
        },

        save_tags() {
            const value = this.$refs.tags.value
            if (!value){return}
            console.log('val', value)
            const name = prompt('please enter a name for these tags:')
            if (!name){return}
            if (this.tags_name.includes(name)){
                const overwrite = confirm('this name already exists, do you want to overwrite it?')
                if (!overwrite){return}
            }
            set_item(`tags_${name}`, value)
            this.load_tags_name()
        },

        load_tags_name() {
            console.log('names', Object.entries(localStorage))
            this.tags_name = []
            for (const [key, value] of Object.entries(localStorage)) {
                if (key.startsWith('tags_')) {
                    this.tags_name.push(key.replace('tags_', ''))
                }
            }
        },

        load_tags(name) {
            const tags = get_item(`tags_${name}`)
            this.$refs.tags.value = tags
            this.tagcount()
            this.convert()
        },
        
        remove_tags(name) {
            const remove = confirm('are you sure you want to remove these tags?')
            if (!remove){return}
            localStorage.removeItem(`tags_${name}`)
            this.load_tags_name()
        }
    },
    mounted: function () {
        this.load_tags_name()
        this.load_progress()
    }
})

app.mount('#app')

function set_item(key, value, encode = false) {
    if (encode) {
        localStorage.setItem(key, JSON.stringify(value))
    } else {
        localStorage.setItem(key, value)
    }
}

function get_item(key, encoded = false) {
    if (encoded) {
        return JSON.parse(localStorage.getItem(key))
    } else {
        return localStorage.getItem(key)
    }
}

