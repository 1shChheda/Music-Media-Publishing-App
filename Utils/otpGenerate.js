const otpGenerate = () =>
{
    /*******************   GENERATING TIME  **************** */

    const expiryDatetime = new Date();
    expiryDatetime.setMinutes(expiryDatetime.getMinutes() + 5);

    /*******************  END OF  GENERATING TIME  **************** */

    // GENERATING OTP between 1000 to 9999 (4 digits)
    let uniqueNum = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
    //Math.floor(Math.random() * (max - min + 1) + min)

    return { Otp: uniqueNum, expiryDatetime };
}

module.exports = otpGenerate;