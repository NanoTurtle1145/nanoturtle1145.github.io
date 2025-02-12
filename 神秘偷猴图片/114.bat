@echo off
setlocal enabledelayedexpansion
set count=100
for /f "delims=" %%i in ('dir /b *.jpg,*.png,*.bmp,*.jpeg,*.gif') do call:Rename "%%~i"
goto :eof

:Rename
set /a count+=1
if %count% LSS 10 set set count=00%count%
if %count% LSS 100 set count=0%count%
if %count% GTR 999 goto :eof
if /i "%~1"=="!count!.png" goto :eof
if exist "!count!.png" goto Rename
echo 改名：%1 !count!.png
ren "%~1" "!count!.png"
goto :eof
