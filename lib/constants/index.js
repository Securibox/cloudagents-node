module.exports = {
    synchronizationState:{
        NewAccount: 0,
        Created: 1,
        Running: 2,
        AgentFailed: 3,
        Delivering: 4,
        PendingAcknowledgement: 5,
        Completed: 6,
        ReportFailed: 7
    },
    synchronizationStateDetails:{
        NewAccount: 1,
        Completed: 2,
        CompletedNothingToDownload: 3,
        CompletedNothingNewToDownload: 4,
        CompletedWithMissingDocs: 5,
        CompletedWithErrors: 6,
        WrongCredentials: 7,
        UnexpectedAccountData: 8,
        Scheduled: 9,
        Pending: 10,
        InProgress: 11,
        DematerialisationNeeded: 12,
        CheckAccount: 13,
        AccountBlocked: 14,
        AdditionalAuthenticationRequired:15,
        LoginPageChanged: 16,
        WelcomePageChanged: 17,
        WebsiteInMaintenance: 18,
        WebsiteChanged: 19,
        ResetPasswordWarning: 20,
        ResetPasswordRequired: 21,
        ServerUnavailable: 22,
        PersonalNotification: 23,
        TemporaryServerError: 24,
        CaptchaFound: 25
    }
};