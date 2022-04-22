const app = Vue.createApp({
    data() {
        return {
            name: "Tags Input",
            tags_name: [],
        }
    },
    methods: {
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

