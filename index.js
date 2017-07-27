module.exports = function crTest(dispatch) {
	
	let CID = null;
	let boss = undefined;
	let teleLocation = null;
	
	const terId = [489, 3802];
	const bhaoId = [489, 3801];
	
	var terDead = false;
	
	let crX = 63475;
	let crY = 38629;
	let crZ = -8876;
	let crW = 0;
	
	let terX = 73130.3203125
	let terY = 38466.71875
	let terZ = -9326.5849609375
	
	let bhaoX = 69805.484375
	let bhaoY = 34493.46875
	let bhaoZ = -9331.388671875
	
	dispatch.hook('S_LOGIN', 1, event => {
		CID = event.cid;
	})
	
	dispatch.hook('cChat', 1 , (event) => {
		if(event.message.includes('!cr')){
			dispatch.hookOnce('S_SPAWN_ME', 1, event => {
				if(crX == event.x && crY == event.y && crZ == event.z)
				{
					terTele();
					return false;
				}
				//console.log(event.x + ' ' + event.y + ' ' + event.z + ' ' + event.w);
			})
			return false;
		}
	});
	
	dispatch.hook('S_BOSS_GAGE_INFO', 2, (event) => {
		if (event.huntingZoneId === terId[0] && event.templateId === terId[1]) {
			boss = event;
		}
		
		else if (event.huntingZoneId === bhaoId[0] && event.templateId === bhaoId[1]){
			boss = event;
		}

		if (boss) {
			let bossHp = bossHealth();
			if (bossHp <= 0 && terDead == false && boss.huntingZoneId === terId[0] && boss.templateId === terId[1]) {
				boss = undefined;
				terDead = true;
				bhaoTele();
			}
			
			if (bossHp <= 0 && terDead == true && boss.huntingZoneId === bhaoId[0] && boss.templateId === bhaoId[1]) {
				boss = undefined;
				terDead = false;
			}
		}
	 })
	 
	 	
	function bossHealth() {
		return (boss.curHp / boss.maxHp);
	}
	
	function terTele()
	{
		dispatch.toClient('S_SPAWN_ME', 1, {
			target: CID,
			x: terX,
			y: terY,
			z: terZ,
			alive: 1,
			unk: 0
		})
	}
	
		function bhaoTele()
	{
		teleLocation = {
			x: bhaoX,
			y: bhaoY,
			z: bhaoZ
		};
		dispatch.toClient('S_INSTANT_MOVE', 1, Object.assign(teleLocation, { id: CID}))
	}
}

