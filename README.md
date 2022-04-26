# Memable.

A stupid-slow meme website powered by Reddit! Works but sucks. Currently just unresponsive preview of this app..

<a href="https://memable.vercel.app" target="_blank">

| Open App |
| -------- |

</a>

<a href="#api">

| View API Usage |
| -------------- |

</a>

<br>

## Screenshots

| ![Image 1](https://i.imgur.com/RuDwXed.png) | ![Image 2](https://i.imgur.com/kMJBTGg.png) |
| ------------------------------------------- | ------------------------------------------- |

## API

`baseurl`: [https://memable.vercel.app](https://memable.vercel.app)

### `/memes`

| Parameter  | Description                                                                               | Example                                               |
| ---------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| subreddits | Comma separated list of subreddits. Use colon to separate if you need to set last post id | subreddits=wholesomememes:`lastIdLOL`,memes,dankmemes |
| filter     | Add filter (`hot`\|`top`\|`new`\|`controversial` \| `raising`)                            | filter=hot                                            |
| max        | Maximum number of memes from each subreddit. Doesn't mean the exact count.                | max=50                                                |

#### Example request & response

```bat
https://memable.vercel.app/memes?subreddits=memes,dankmemes:uc569x,wholesomememes&filter=hot&max=69
```

<a href="./example-response.json">

| Example response |
| ---------------- |

</a>
