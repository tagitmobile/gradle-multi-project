type byte = 0 | 1;
export interface User {
    accessEndTime?: string;
    accessExpiryDt?: Date;
    accessStartTime?: string;
    allowExpiredPasswordCount?: number;
    authSignLevel?: number;
    createdBy?: string;
    createdDate?: Date;
    flag?: number;
    flexiField1?: string;
    flexiField2?: string;
    flexiField3?: string;
    flexiField4?: string;
    groupId?: string;
    isForceChangePswd?: byte;
    lastLoginAttemptCnt?: number;
    lastLoginAttemptDt?: Date;
    lastLoginAttemptIp?: string;
    lastLoginDt?: Date;
    lastLoginIp?: string;
    merchantId?: number;
    merchantKeyword?: string;
    passwordExpiryDate?: Date;
    passwordExpiryMessage?: string;
    pswd?: string;
    pswdChangeDate?: Date;
    pswdStatus?: string;
    remarks?: string;
    pswdStatusChangeDate?: Date;
    resetAttemptCnt?: number;
    securityQuesList?: [
        {
            createdBy?: string,
            ltbPrimaryKey?: number,
            secretAns?: string,
            securityKey?: number
        }
    ];
    status?: string;
    statusChangeDate?: Date;
    updatedBy?: string;
    updatedDate?: Date;
    userEmail?: string;
    userId?: string;
    userMobileNo?: string;
    userName?: string;
    userProfiles?: [
        {
            profileKey?: number
        }
    ];
    userType?: string;
    version?: number;
}
