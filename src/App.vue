<template>
  <div id="app" style="user-select:auto; margin-top:0px; border-top-width:0px;">
    <div style="display: flex; flex-direction: column;">
      <!-- Upload Interface -->
      <div id="upload" style="font-weight:bolder;">
        <div style="font-weight:bolder;"v-if="this.$root.$data.loading === false">
          <h1 >Welcome to the our DAPP</h1>
          <h4>To make memories just add a post</h4>

          <!-- Form for file choose, caption text and submission -->
          <form class="margin-sm "  @submit.stop.prevent="handleSubmit">
            <div class="border-style border-light " >
              <b-form-file class="mt-2 mb-2 ml-2 "plain @change="captureFile"  size="80"/>
            </div>
            <b-form-textarea
              v-model="caption"
              placeholder="Please share the captions"
              :rows="4"
              :max-rows="6"
              class="margin-xs border-style"
              style="font-size:20px;"
            />
            <b-button class="btn margin-xs btn-lg" variant="info" @click="handleOk">
              Upload
            </b-button>
          </form>
        </div>
        <div
          v-if="this.$root.$data.loading === true"
          style="margin-top: 10%; margin-bottom: 5%"
        >
          <img
            class="upload-load"
            src="https://giphy.com/embed/3o6UB5ZDBxaZwiL7RC"
          />
        </div>
      </div>

      <!-- Posts Interface -->
      <ul class="home-list">
        <li
          v-for="item in this.$root.$data.currentPosts"
          :key="item.key"
          :item="item"
        >
          <!-- Card UI for post's image & caption text -->
          <b-card border-variant="none" :img-src="item.src">
            <p class="home-card-text">
              {{ item.caption }}
            </p>
          </b-card>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import ipfs from "./contracts/ipfs";

export default {
  name: "App",
  // data variables
  data() {
    return {
      buffer: "",
      caption: "",
    };
  },
  methods: {
    /* used to catch chosen image &
     * convert it to ArrayBuffer.
     */
    captureFile(file) {
      const reader = new FileReader();
      if (typeof file !== "undefined") {
        reader.readAsArrayBuffer(file.target.files[0]);
        reader.onloadend = async () => {
          this.buffer = await this.convertToBuffer(reader.result);
        };
      } else this.buffer = "";
    },

    async convertToBuffer(reader) {
      return Buffer.from(reader);
    },

    onSubmit() {
      alert("Please wait while we uplaod your image to IPFS...");
      this.$root.loading = true;
      let imgHash;
      ipfs
        .add(this.buffer)
        .then((hashedImg) => {
          imgHash = hashedImg[0].hash;
          imgHash = hashedImg[0].hash;
          console.log("imgHash: " + imgHash);
          return this.convertToBuffer(this.caption);
        })
        .then((bufferDesc) =>
          ipfs.add(bufferDesc).then((hashedText) => hashedText[0].hash)
        )
        .then((textHash) => {
          this.$root.contract.methods
            .sendHash(imgHash, textHash)
            .send(
              { from: this.$root.currentAccount },
              (error, transactionHash) => {
                if (typeof transactionHash !== "undefined") {
                  alert("Just a few moment while we store the image on Ethereum");
                  this.$root.contract.once(
                    "NewPost",
                    { from: this.$root.currentAccount },
                    () => {
                      this.$root.getPosts();
                      alert("Congratulations your image is posted.");
                    }
                  );
                } else this.$root.loading = false;
              }
            );
        });
    },
    /**
     * validates if image & captions
     * are filled before submission.
     */
    handleOk() {
      if (!this.buffer || !this.caption) {
        alert("Oops you forget to give the caption or (and) image");
      } else {
        this.onSubmit();
      }
    },
  },
};
</script>

<style>
#app {
  font-family:  'Sedgwick Ave', cursive, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  justify-content: center;
  color: #054A45 ;
  background: url('./images/background2.jpg');
  background-size:contain;
  background-position:center;
  /* background repeat:no-repeat; */
  /* margin-top: 3%; */
  height:auto;
  
}
.home-load {
  width: 100px;
  height: 50px;
}
.card img {
  object-fit: cover;
  height: 500px;
  width: 1000px;
  border-radius:10px;
  box-shadow: 0 20px 25px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)
}
.card {
  text-align:center;
  width: 1000px;
  margin-bottom: 10px;
}
.home-list {
  padding: 0;
  list-style: none;
  width:auto;
}
.home-card-text {
  text-align: center;
  font-size:30px;
  margin-top: 0px;
  padding: 10px 20px;
}
#upload {
  font-family: 'Sedgwick Ave', cursive, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fff  ;
  margin-bottom: 5%;
  width: 1000px;
  font-weight: medium;
  font-size:18px;
}
.upload-load {
  width: 50px;
  height: 50px;
}
.margin-xs  {
  margin-top: 2%;
}
.margin-sm align{
  margin-top: 4%;
}
.border-style {
  border: 1px solid #033267;
}
h1 {
  font-weight: bold;
  color: #fff;
  font-size: 70px;
}
h4{
  font-weight:bold;
  color:#fff;
  font-size: 30px;
}
</style>
