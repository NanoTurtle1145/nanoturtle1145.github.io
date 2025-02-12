@echo off
setlocal enabledelayedexpansion
set count=100
for /f "delims=" %%i in ('dir /b *.jpg,*.png,*.bmp,*.jpeg,*.gif') do call:Rename "%%~i"
goto :eof

:Rename
set /a count+=1
if /i "%~1"=="!count:~1!.png" goto :eof
if exist "!count:~1!.png" goto Rename
echo 改名：%1 !count:~1!.png
ren "%~1" "!count:~1!.png"
goto :eof
