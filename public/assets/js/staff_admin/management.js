staffRecord = [
    {
        'user_id': '001',
        'name': 'Nino Nakano',
        'birth_date': '2000-05-05',
        'department': 'culinary',
        'role': 'best girl',
        'profile_picture': 'https://bit.ly/2NJfJ5n'
    },
    {
        'user_id': '002',
        'name': 'Kurumi Tokisaki',
        'birth_date': '2000-01-01',
        'department': 'veterinary',
        'role': 'best girl',
        'profile_picture': 'https://i.ytimg.com/vi/HPynobNcZAU/hqdefault.jpg'
    },
    {
        'user_id': '003',
        'name': 'Shido Itsuka',
        'birth_date': '2000-08-03',
        'department': 'housewife',
        'role': 'best boy',
        'profile_picture': 'https://pbs.twimg.com/profile_images/820479236179783680/5EUm7iXl.jpg'
    },
    {
        'user_id': '004',
        'name': 'Jeanne d\'Arc',
        'birth_date': '1412-01-06',
        'department': 'saint',
        'role': 'best girl',
        'profile_picture': 'https://bit.ly/2JW2wVX'
    },
    {
        'user_id': '005',
        'name': 'Jibril Archangel',
        'birth_date': '0000-01-01',
        'department': 'bibliophile',
        'role': 'best girl',
        'profile_picture': 'https://bit.ly/2qlxCiS'
    },
    {
        'user_id': '006',
        'name': 'Origami Tobiichi',
        'birth_date': '2000-04-10',
        'department': 'soldier',
        'role': 'best girl',
        'profile_picture': 'https://66.media.tumblr.com/e69bd60591bf3765125db7fbc132316b/tumblr_ot5ic7qKwf1vy2tgqo7_250.jpg'
    },
    {
        'user_id': '007',
        'name': 'Ririna Sanada',
        'birth_date': '2001-03-31',
        'department': 'student',
        'role': 'best girl',
        'profile_picture': 'https://pbs.twimg.com/media/D18bKiaXQAMzT4q.jpg'
    },
    {
        'user_id': '008',
        'name': 'Mikoto Misaka',
        'birth_date': '2000-05-02',
        'department': 'student',
        'role': 'best girl',
        'profile_picture': 'http://www.ah.xinhuanet.com/2015-04/09/1114914317_14285490003871n.jpg'
    }
]

if (canRead == 'true') {
    const getItemFromUserId = function(items, id) {
        return items.find(function(item) {
            return item['user_id'] == id
        })
    }
    const refreshPage = function(delay) {
        setTimeout(function() {
            location.reload(true)
        }, delay)
    }
    let updateList = new Set()
    let deleteList = new Set()
    const editableList = new Set(['department', 'role'])
    let staffList = document.getElementsByTagName('staffList')[0]
    let staffCard = staffList.getElementsByTagName('staffCard')[0]
    let infos = staffCard.getElementsByTagName('information')[0]
    let info = infos.getElementsByTagName('p')[0]
    infos.removeChild(info)
    staffList.removeChild(staffCard)
    let generateStaffCard = function(staffs, isMockup) {
        staffs.forEach(function(staff) {
            let newStaffCard = staffCard.cloneNode(true)
            let newInfo = info.cloneNode(true)
            if (staff['profile_picture']) {
                newStaffCard.getElementsByTagName('profilePicture')[0].style.backgroundImage = `url('${staff['profile_picture']}')`
            }
            delete staff['profile_picture']
            newStaffCard.getElementsByClassName('user_id')[0].textContent = staff['user_id']
            staff['birth_date'] = new Date(staff['birth_date']).toDateString().substring(4)
            for (const [key, value] of Object.entries(staff)) {
                if (key == 'user_id') continue
                newInfo.getElementsByTagName('yTitle')[0].textContent = key
                newInfo.getElementsByTagName('yDetail')[0].textContent = value
                if (editableList.has(key)) {
                    newInfo.getElementsByTagName('yDetail')[0].className = '' + key
                }
                newStaffCard.getElementsByTagName('information')[0].appendChild(newInfo.cloneNode(true))
            }
            staffList.appendChild(newStaffCard)
        })
        if (canUpdate == 'true') {
            Array.prototype.forEach.call(document.getElementsByClassName('editButton'), function(item, index) {
                item.addEventListener('click', function() {
                    let thisStaffCard = this.parentNode.parentNode
                    let strInput = Array.from(editableList, function(s) {
                        return `<div class="form-group">
                        <label for="${s}">${s}</label>
                        <input type="text" class="form-control" id="${s}" placeholder="${thisStaffCard.getElementsByClassName(s)[0].textContent}">
                      </div>`
                    }).join('')
                    Swal.fire({
                        title: 'Edit some information',
                        html: strInput,
                        focusConfirm: false,
                        showCancelButton: true,
                        preConfirm: function() {
                            [...editableList].forEach(function(item) {
                                let previousInfo = thisStaffCard.getElementsByClassName(item)[0]
                                const thisStaffId = thisStaffCard.getElementsByClassName('user_id')[0].textContent
                                if (document.getElementById(item).value && document.getElementById(item).value != previousInfo.textContent) {
                                    previousInfo.textContent = document.getElementById(item).value
                                    previousInfo.parentNode.classList.add('isChanged')
                                    updateList.add(thisStaffId)
                                }
                                if (document.getElementById(item).value == getItemFromUserId(staffs, thisStaffId)[item]) {
                                    previousInfo.parentNode.classList.remove('isChanged')
                                    updateList.delete(thisStaffId)
                                }
                            })
                        }
                    })
                })
            })
        }
        if (canDelete == 'true') {
            Array.prototype.forEach.call(document.getElementsByClassName('deleteButton'), function(item) {
                item.addEventListener('click', function() {
                    let selec = this
                    Swal.fire({
                        icon: 'warning',
                        title: 'Do you really want to delete?',
                        showCancelButton: true
                    }).then(function(result) {
                        if (result.value) {
                            let thisStaff = selec.parentNode.parentNode
                            deleteList.add(thisStaff.getElementsByClassName('user_id')[0].textContent)
                            staffList.removeChild(thisStaff)
                        }
                    })
                })
            })
        }
        if (!isMockup && (canUpdate == 'true' || canDelete == 'true')) {
            document.getElementById('save').addEventListener('click', function() {
                Swal.fire({
                    icon: 'warning',
                    title: 'Are you sure?',
                    html: 'The current information<br/>will be updated in the server',
                    showCancelButton: true
                }).then(function(result) {
                    if (result.value) {
                        if (updateList.size == 0 && deleteList.size == 0) {
                            Swal.fire({
                                icon: 'info',
                                title: 'Nothing',
                                text: 'You did\'t change anything',
                                showConfirmButton: false,
                                timer: 1500
                            })
                        } else {
                            checkConflict(updateFn)
                        }
                    }
                })
            })
        }
    }

    const checkConflict = function(callback) {
        $.ajax({
            url: '/admin/staff/getQuery',
            method: 'POST',
            data: {
                sql: `SELECT * FROM staff_admin_info WHERE status='inactive'`
            }
        }).done(function(data, textStatus, jqXHR) {
            if (data.status == 200) {
                let denied = 'false'
                // Check if some of staff was just changed to be inactive
                if (updateList.size) {
                    for (let i = 0; i < data.result.length; ++i) {
                        if (updateList.has(data.result[i]['user_id'])) {
                            denied = 'true'
                            break
                        }
                    }
                }
                if (denied == 'false') {
                    callback(deleteFn)
                    return
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Something was wrong',
                        text: 'some information of staff has been changed',
                        showConfirmButton: false,
                        timer: 1200
                    })
                    refreshPage(1000)
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops, something went wrong',
                    showConfirmButton: false,
                    timer: 1200
                })
            }
        })
    }
    const updateFn = function(callback) {
        if (updateList.size == 0) {
            callback(function() {
                refreshPage(1000)
            })
            return
        }
        let updateValues = []
        Array.prototype.forEach.call(document.getElementsByTagName('staffCard'), function(item) {
            if (updateList.has(item.getElementsByClassName('user_id')[0].textContent)) {
                updateValues.push(`('${item.getElementsByClassName('user_id')[0].textContent}','${item.getElementsByClassName('department')[0].textContent}','${item.getElementsByClassName('role')[0].textContent}')`)
            }
        })
        $.ajax({ // Call to update info
            url: '/admin/staff/sendQuery',
            method: 'POST',
            data: {
                sql: `INSERT INTO staff_admin_info(staffId, department, role) VALUES ${updateValues.join(',')} ON DUPLICATE KEY UPDATE department=VALUES(department), role=VALUES(role)`
            }  
        }).done(function(data, textStatus, jqXHR) {
            if (data.status == 200) {
                callback(function() {
                    refreshPage(1200)
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Something was wrong',
                    text: 'can\'t update new information',
                    showConfirmButton: false,
                    timer: 1200
                })
                refreshPage(1000)
            }
        })
    }
    const deleteFn = function(callback) {
        if (deleteList.size == 0) {
            Swal.fire({
                icon: 'success',
                title: 'No problem',
                text: 'all information has been updated',
                showConfirmButton: false,
                timer: 1200
            })
            callback()
            return
        }
        const deleteStaffs = Array.from(deleteList, function(s) {
            return `'${s}'`
        }).join(',')
        $.ajax({ // Call to delete staff
            url: '/admin/staff/sendQuery',
            method: 'POST',
            data: {
                sql: `UPDATE staff_admin_info SET status='inactive' WHERE staffId IN (${deleteStaffs})`
            }
        }).done(function(data, textStatus, jqXHR) {
            if (data.status == 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'No problem',
                    text: 'all information has been updated',
                    showConfirmButton: false,
                    timer: 1200
                })
                callback()
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Something was wrong',
                    text: 'can\'t update new information',
                    showConfirmButton: false,
                    timer: 1200
                })
                refreshPage(1000)
            }
        })
    }

    Swal.fire({
        icon: 'info',
        title: 'Mockup?',
        html: '<p>We recommend to use mockup first</p><span>\'Save\' system are still in development</span>',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Yes, use mockup',
        cancelButtonText: 'No, don\'t use mockup'
    }).then(function(result) {
        if (result.value) {
            generateStaffCard(staffRecord, true)
        } else {
            generateStaffCard(data, false)
        }
    })
}