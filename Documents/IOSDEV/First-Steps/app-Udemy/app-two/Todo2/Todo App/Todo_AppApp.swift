//
//  Todo_AppApp.swift
//  Todo App
//
//  Created by Roberta Marino on 04/11/23.
//

import SwiftUI

@main
struct Todo_AppApp: App {
    // inject into SwiftUI life-cycle via adaptor !!!
        @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate

    let persistenceController = PersistenceController.shared

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(\.managedObjectContext, persistenceController.container.viewContext)
        }
    }
}
