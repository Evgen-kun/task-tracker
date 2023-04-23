<template>
    <v-card
        class="mx-2"
        width="100%"
        min-width="270"
        rounded="xl"
    >
        <v-card-item>
        <div>
            <!-- <div class="text-overline mb-1">
            OVERLINE
            </div> -->
            <div class="text-h6 mb-1">
                {{ item.title }}
            </div>
            <div class="text-h2">{{ item.value }}</div>
        </div>
        </v-card-item>
    </v-card>
</template>
    
<script>
  
export default {
    name: "DashboardCardComponent",
    data() {
        return {
            
        }
    },
    props: {
        item: {
            type: Object,
            required: true
        },
    },
    methods: {
        
    },
    computed: {
        
    },
  }
</script>