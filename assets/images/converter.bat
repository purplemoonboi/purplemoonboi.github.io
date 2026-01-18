@echo off
for %%f in (*.*) do (
    set "name=%%~nf"
    set "ext=%%~xf"
    call :process "%%f" "%%ext%%"
)
echo Done.
exit /b

:process
set "ext=%~2"
if /I "%ext%"==".PNG" ren "%~1" "%~n1.png"
if /I "%ext%"==".Png" ren "%~1" "%~n1.png"
if /I "%ext%"==".pNg" ren "%~1" "%~n1.png"
if /I "%ext%"==".pnG" ren "%~1" "%~n1.png"
if /I "%ext%"==".pNG" ren "%~1" "%~n1.png"
if /I "%ext%"==".PnG" ren "%~1" "%~n1.png"
if /I "%ext%"==".PNg" ren "%~1" "%~n1.png"
exit /b