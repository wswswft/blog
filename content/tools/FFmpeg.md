---
title: "FFmpeg"
description: "FFmpeg 安装与常用音视频处理命令"
tags:
  - "tool"
  - "audio-video"
---
# FFmpeg

## 学习资源

1. **官方文档**：https://ffmpeg\.org/documentation\.html

2. **FFmpeg Wiki**：https://trac\.ffmpeg\.org/wiki

3. **常用命令速查表**：https://gist\.github\.com/steven2358/ba153c642fe2bb1e47485962df07c730

## 一、FFmpeg 简介

FFmpeg 是一个开源的音视频处理工具集，包含：

- **ffmpeg**：音视频转换工具

- **ffplay**：简单的播放器

- **ffprobe**：媒体文件分析工具

- **libavcodec**：编解码库

- **libavformat**：格式处理库

## 二、安装 FFmpeg

Ubuntu/Debian

```Bash
sudo apt update
sudo apt install ffmpeg
```



## 三、基础命令格式

```Bash
ffmpeg [全局选项] [输入文件选项] -i 输入文件 [输出文件选项] 输出文件
```



## 四、常用操作

### 1\. **查看文件信息**

```Bash
ffmpeg -i input.mp4
ffprobe input.mp4
ffprobe -v quiet -print_format json -show_format -show_streams input.mp4
```

### 2\. **格式转换**

```Bash
# MP4 转 AVI
ffmpeg -i input.mp4 output.avi

# MP4 转 MOV
ffmpeg -i input.mp4 output.mov

# MP4 转 WebM
ffmpeg -i input.mp4 -c:v libvpx -c:a libvorbis output.webm

# MP4 转 GIF
ffmpeg -i input.mp4 output.gif
```

### 3\. **视频处理**

**提取音频**

```Bash
# 提取 MP3
ffmpeg -i input.mp4 -vn -acodec mp3 output.mp3

# 提取 AAC
ffmpeg -i input.mp4 -vn -acodec aac output.aac

# 提取 WAV
ffmpeg -i input.mp4 -vn -acodec pcm_s16le output.wav
```

**提取视频（无音频）**

```Bash
ffmpeg -i input.mp4 -an -vcodec copy output_video.mp4
```

**裁剪视频**

```Bash
# 按时间裁剪
ffmpeg -i input.mp4 -ss 00:01:00 -t 00:00:30 -c copy output.mp4

# 按时间段裁剪
ffmpeg -i input.mp4 -ss 00:01:00 -to 00:01:30 -c copy output.mp4
```

**合并视频**

```Bash
# 创建文件列表
echo "file 'part1.mp4'" > list.txt
echo "file 'part2.mp4'" >> list.txt

# 合并
ffmpeg -f concat -i list.txt -c copy output.mp4
```

**调整分辨率**

```Bash
# 调整为 1280x720
ffmpeg -i input.mp4 -vf scale=1280:720 output.mp4

# 保持宽高比，宽度为 1280
ffmpeg -i input.mp4 -vf scale=1280:-1 output.mp4

# 保持宽高比，高度为 720
ffmpeg -i input.mp4 -vf scale=-1:720 output.mp4
```

**调整码率**

```Bash
# 视频码率 1M，音频码率 128k
ffmpeg -i input.mp4 -b:v 1M -b:a 128k output.mp4
```

**调整帧率**

```Bash
# 改为 30fps
ffmpeg -i input.mp4 -r 30 output.mp4
```

**旋转视频**

```Bash
# 顺时针旋转90度
ffmpeg -i input.mp4 -vf "transpose=1" output.mp4

# 逆时针旋转90度
ffmpeg -i input.mp4 -vf "transpose=2" output.mp4

# 旋转180度
ffmpeg -i input.mp4 -vf "transpose=2,transpose=2" output.mp4
```

**添加水印**

```Bash
# 图片水印
ffmpeg -i input.mp4 -i watermark.png -filter_complex "overlay=10:10" output.mp4

# 文字水印
ffmpeg -i input.mp4 -vf "drawtext=text='My Watermark':x=10:y=10:fontsize=24:fontcolor=white" output.mp4
```

**去除水印**

```Bash
ffmpeg -i input.mp4 -vf "delogo=x=10:y=10:w=100:h=50" output.mp4
```

### 4\. **音频处理**

**调整音量**

```Bash
# 音量加倍
ffmpeg -i input.mp3 -af "volume=2.0" output.mp3

# 降低音量到一半
ffmpeg -i input.mp3 -af "volume=0.5" output.mp3

# 增加 10dB
ffmpeg -i input.mp3 -af "volume=10dB" output.mp3
```

**提取音频片段**

```Bash
ffmpeg -i input.mp3 -ss 00:01:00 -t 00:00:30 output.mp3
```

**合并音频**

```Bash
# 合并两个音频文件
ffmpeg -i input1.mp3 -i input2.mp3 -filter_complex "[0:a][1:a]concat=n=2:v=0:a=1" output.mp3
```

**转换采样率**

```Bash
ffmpeg -i input.mp3 -ar 44100 output.mp3
```

**转换声道**

```Bash
# 立体声转单声道
ffmpeg -i input.mp3 -ac 1 output.mp3

# 单声道转立体声
ffmpeg -i input.mp3 -ac 2 output.mp3
```

### 5\. **屏幕录制**

**录制屏幕（Linux）**

```Bash
ffmpeg -f x11grab -s 1920x1080 -i :0.0 -f alsa -i default output.mp4
```

**录制屏幕（macOS）**

```Bash
ffmpeg -f avfoundation -i "1:0" output.mp4
```

**录制屏幕（Windows）**

```Bash
ffmpeg -f gdigrab -i desktop output.mp4
```

### 6\. **直播推流**

**推流到 RTMP**

```Bash
ffmpeg -re -i input.mp4 -c copy -f flv rtmp://server/live/stream_key
```

**拉流并保存**

```Bash
ffmpeg -i rtmp://server/live/stream_key -c copy output.mp4
```

**HLS 切片**

```Bash
ffmpeg -i input.mp4 -c:v libx264 -c:a aac -f hls -hls_time 10 -hls_list_size 0 output.m3u8
```

### 7\. **高级功能**

**提取关键帧**

```Bash
ffmpeg -i input.mp4 -vf "select='eq(pict_type,PICT_TYPE_I)'" -vsync vfr keyframes_%03d.jpg
```

**生成缩略图**

```Bash
# 每秒一张
ffmpeg -i input.mp4 -vf fps=1 thumbnails_%03d.jpg

# 每10秒一张
ffmpeg -i input.mp4 -vf fps=1/10 thumbnails_%03d.jpg
```

**加速/减速视频**

```Bash
# 2倍速
ffmpeg -i input.mp4 -vf "setpts=0.5*PTS" -af "atempo=2.0" output.mp4

# 0.5倍速
ffmpeg -i input.mp4 -vf "setpts=2.0*PTS" -af "atempo=0.5" output.mp4
```

**添加字幕**

```Bash
# 硬字幕
ffmpeg -i input.mp4 -vf "subtitles=subtitle.srt" output.mp4

# 软字幕
ffmpeg -i input.mp4 -i subtitle.srt -c copy -c:s mov_text output.mp4
```

**提取字幕**

```Bash
ffmpeg -i input.mp4 -map 0:s:0 subtitle.srt
```



### 8\. **常用滤镜**

**视频滤镜**

```Bash
# 模糊
ffmpeg -i input.mp4 -vf "boxblur=5:1" output.mp4

# 锐化
ffmpeg -i input.mp4 -vf "unsharp=5:5:1.0:5:5:0.0" output.mp4

# 反交错
ffmpeg -i input.mp4 -vf yadif output.mp4

# 裁剪
ffmpeg -i input.mp4 -vf "crop=640:480:100:100" output.mp4
```

**音频滤镜**

```Bash
# 淡入淡出
ffmpeg -i input.mp3 -af "afade=t=in:st=0:d=3,afade=t=out:st=30:d=3" output.mp3

# 均衡器
ffmpeg -i input.mp3 -af "equalizer=f=1000:width_type=h:width=200:g=5" output.mp3

# 降噪
ffmpeg -i input.mp3 -af "afftdn=nf=-20" output.mp3
```

### 9\. **编码器设置**

**H\.264 编码**

```Bash
# 高质量
ffmpeg -i input.mp4 -c:v libx264 -crf 18 -preset slow -c:a copy output.mp4

# 中等质量
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a copy output.mp4

# 低质量（小文件）
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -preset fast -c:a copy output.mp4
```

**H\.265/HEVC 编码**

```Bash
ffmpeg -i input.mp4 -c:v libx265 -crf 28 -preset medium -c:a copy output.mp4
```

**VP9 编码**

```Bash
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus output.webm
```

### 10\. **实用脚本示例**

**批量转换**

```Bash
#!/bin/bash
for file in *.avi; do
    ffmpeg -i "$file" "${file%.avi}.mp4"
done
```

**批量提取音频**

```Bash
#!/bin/bash
for file in *.mp4; do
    ffmpeg -i "$file" -vn -acodec mp3 "${file%.mp4}.mp3"
done
```

**批量调整分辨率**

```Bash
#!/bin/bash
for file in *.mp4; do
    ffmpeg -i "$file" -vf scale=1280:720 "resized_${file}"
done
```

### 11\. **常见问题解决**

**错误：不支持格式**

```Bash
# 查看支持的格式
ffmpeg -formats

# 查看支持的编码器
ffmpeg -codecs
```

**错误：编码器不可用**

```Bash
# 安装额外编码器
sudo apt install libavcodec-extra
```

**保持质量的同时减小文件大小**

```Bash
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset slower -c:a aac -b:a 128k output.mp4
```

### 12\. **性能优化**

**使用硬件加速**

```Bash
# NVIDIA GPU (Linux)
ffmpeg -hwaccel cuda -i input.mp4 output.mp4

# Intel QuickSync (Linux)
ffmpeg -hwaccel qsv -i input.mp4 output.mp4

# macOS
ffmpeg -hwaccel videotoolbox -i input.mp4 output.mp4
```

**多线程编码**

```Bash
ffmpeg -i input.mp4 -threads 4 output.mp4
```

### 13\. **常用快捷键（ffplay）**

- `q` 或 `ESC`：退出

- `f`：全屏

- `p` 或 `空格`：暂停/播放

- `m`：静音

- `9` 和 `0`：音量调节

- `/` 和 `*`：音量调节

- `a`：循环播放

- `v`：显示视频帧信息

- `s`：逐帧播放
