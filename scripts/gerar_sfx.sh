mk(){ earshot make --sound "$1" --n "$2" -o "$3.wav" >/dev/null 2>&1 || echo "FAIL $1"; }
mk whoosh/airy 3 whoosh_airy; mk whoosh/heavy 2 whoosh_heavy; mk whoosh/low 1 whoosh_low; mk swish/fast 3 swish_fast
mk dash/air 3 dash_air; mk send/swoosh 2 send_swoosh; mk whoosh/pass 1 whoosh_pass; mk cymbal/reverse 2 cymbal_rev
mk boom/heavy 2 boom_heavy; mk land/heavy 2 land_heavy; mk land/soft 2 land_soft; mk book/shut 1 book_shut
mk pop/mouth 3 pop_mouth; mk like/pop 3 like_pop; mk bubblewrap/pop 2 bubble_pop; mk receive/cork 2 cork
mk click/mouse 1 click_mouse; mk type/mechanical 4 type_mech; mk type/light 4 type_light
mk glass/break 2 glass_break; mk bulb/burst 1 bulb_burst; mk swing/blade 2 swing_blade; mk sword/swing 1 sword_swing
mk clash/sword 1 clash_sword; mk sword/draw 1 sword_draw; mk tick/metal 2 tick_metal; mk tick/wood 3 tick_wood
mk success/done 1 success_done; mk power_up/rise 1 power_up; mk jump/heavy 1 jump_heavy; mk timpani/hit 1 timpani
mk slam/title 2 slam_title; mk suck/in 2 suck_in; mk rise/reverse 2 rise_reverse; mk impact/suck 1 impact_suck
mk thump/appear 3 thump_appear; mk whoosh/fast 3 whoosh_fast; mk whoosh/deep 2 whoosh_deep; mk whoosh/sweep 2 whoosh_sweep
mk pop/soft 3 pop_soft; mk boom/deep 2 boom_deep; mk toy/squeak 1 toy_squeak; mk stopwatch/tick 1 stopwatch
mk toggle/rocker_on 2 rocker; mk whip/swish 1 whip_swish; mk door/slam 1 door_slam
echo DONE
