<template>
  <Head>
    <Title>{{ $config.public.projectMetadataTitle }}</Title>
    <Meta name="description" :content="$config.public.projectDescription" />
    <Link rel="icon" type="image/x-icon" :href="$config.public.favicon" />

    <Meta property="og:title" :content="$config.public.projectMetadataTitle" />
    <Meta property="og:description" :content="$config.public.projectDescription" />
    <Meta property="og:image" :content="$config.public.projectUrl + $config.public.previewImage" />

    <Meta name="twitter:card" content="summary_large_image" />
    <Meta name="twitter:site" :content="$config.public.projectTwitter" />
    <Meta name="twitter:creator" :content="$config.public.projectTwitter" />
    <Meta name="twitter:title" :content="$config.public.projectMetadataTitle" />
    <Meta name="twitter:description" :content="$config.public.projectDescription" />
    <Meta name="twitter:image" :content="$config.public.projectUrl + $config.public.previewImage" />
    
    <Meta
      name="fc:miniapp"
      :content='`{
        "version":"next",
        "imageUrl":"${$config.public.projectUrl}/img/share.png",
        "button":{
          "title":"${$config.public.projectMetadataTitle}",
          "action":{
            "type":"launch_frame",
            "name":"${$config.public.projectMetadataTitle}",
            "url":"${$config.public.projectUrl}",
            "splashImageUrl":"${$config.public.projectUrl}/img/logo-200.png",
            "splashBackgroundColor":"#002b36"
          }
        }
      }`'
    />
  </Head>

  <div>
    <Navbar />
    <NuxtPage />
  </div>
</template>

<script>
import { sdk } from '@farcaster/miniapp-sdk'
import Navbar from './components/Navbar.vue'

export default {
  components: {
    Navbar
  },
  mounted() {
    sdk.actions.ready() // This is required to use the Farcaster SDK
  },
}
</script>
