import subprocess
from pathlib import Path

# ================= 配置区 =================
# 你的工作目录路径
BASE_DIR = Path("/Users/heshan3/Documents/Sponge/resources/gif_designtool")
# 建立一个专门存放网页优化版视频的文件夹
OUTPUT_DIR = BASE_DIR / "web_video"

# 1. 裁剪底部任务栏 50px
CROP_BOTTOM_PIXELS = 50
# 2. 将视频宽度等比缩放到 1080px (如果网页不需要这么大，可以改 800)
SCALE_WIDTH = 1080
VF_FILTER = f"crop=in_w:in_h-{CROP_BOTTOM_PIXELS}:0:0,scale={SCALE_WIDTH}:-1"

# ================= 逻辑区 =================
def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    mp4_files = list(BASE_DIR.glob("*.mp4"))
    
    if not mp4_files:
        print("❌ 未找到 .mp4 文件。")
        return

    print(f"✅ 找到 {len(mp4_files)} 个视频，开始进行网页端终极瘦身...")

    for video_path in mp4_files:
        # 给新文件加上 _web 后缀以示区别
        output_path = OUTPUT_DIR / f"{video_path.stem}_web.mp4"
        
        cmd = [
            "ffmpeg",
            "-y",
            "-i", str(video_path),
            "-vf", VF_FILTER,          # 应用裁剪和缩放
            "-c:v", "libx264",         # 使用兼容性最强、压缩率极高的 H.264 编码
            "-crf", "28",              # 压缩率控制（18-28，数字越大体积越小，28对UI录屏很完美）
            "-preset", "slower",       # 牺牲一点点导出时间，换取更小的文件体积
            "-pix_fmt", "yuv420p",     # 确保所有浏览器(Safari/Chrome)都能正常解析颜色
            "-an",                     # 强制移除音频流 (省空间关键)
            "-movflags", "+faststart", # 网页秒开魔法：允许视频边下载边播放！
            str(output_path)
        ]
        
        print(f"⏳ 正在压缩: {video_path.name} ...")
        
        try:
            subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            print(f"  └─ ✨ 成功! ({output_path.name})")
        except subprocess.CalledProcessError:
            print(f"  └─ ❌ 失败: {video_path.name}")

    print("\n🎉 所有视频处理完毕！去 web_video 文件夹看看它们有多小吧。")

if __name__ == "__main__":
    main()